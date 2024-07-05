import { Injectable } from '@nestjs/common'

import { execSync } from 'child_process'
import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import { join } from 'path'

@Injectable()
export class DynamicCollectionsService {
  constructor() {
    this.watchFieldDefinitions()
  }

  async watchFieldDefinitions() {
    const collectionsDir = join(process.cwd(), 'src', 'collections')
    const watcher = chokidar.watch(`${collectionsDir}/*.ts`, {
      persistent: true
    })

    watcher
      .on('add', path => this.handleFileChange(path))
      .on('change', path => this.handleFileChange(path))
      .on('unlink', path => this.handleFileDeletion(path))
  }

  async handleFileChange(filePath: string) {
    try {
      const module = this.loadTsFile(filePath)
      const key = Object.keys(module)[0]
      const { slug: modelName, fields } = module[key]
      console.log(`Creating or updating module ${modelName}`)
      console.log(fields)
      await this.createOrUpdateModule(modelName, fields)
    } catch (error) {
      console.error(`Failed to handle file change: ${error.message}`)
    }
  }

  async handleFileDeletion(filePath: string) {
    try {
      const module = this.loadTsFile(filePath)
      const { slug: modelName } = module
      await this.deleteModule(modelName)
    } catch (error) {
      console.error(`Failed to handle file deletion: ${error.message}`)
    }
  }

  loadTsFile(filePath: string): any {
    const result = execSync(
      `ts-node -e "console.log(JSON.stringify(require('${filePath.replace(/\\/g, '\\\\')}')))"`
    )
    return JSON.parse(result.toString())
  }

  async createOrUpdateModule(modelName: string, fields: any[]) {
    console.log(`Creating or updating module ${modelName}`)
    const srcDir = join(
      process.cwd(),
      'src',
      'modules',
      modelName.toLowerCase()
    )

    await fs.ensureDir(srcDir)
    await fs.ensureDir(join(srcDir, 'dto'))
    await fs.ensureDir(join(srcDir, 'entity'))

    const moduleContent = this.generateModuleContent(modelName)
    const resolverContent = this.generateResolverContent(modelName)
    const dtoContent = this.generateDtoContent(modelName, fields)
    const entityContent = this.generateEntityContent(modelName, fields)
    const serviceContent = this.generateServiceContent(modelName)

    await fs.writeFile(
      join(srcDir, 'entity', `${modelName}.entity.ts`),
      entityContent,
      { mode: 0o664 }
    )
    await fs.writeFile(join(srcDir, 'dto', `${modelName}.dto.ts`), dtoContent, {
      mode: 0o664
    })
    await fs.writeFile(
      join(srcDir, 'dto', `${modelName}Input.dto.ts`),
      this.generateInputDtoContent(modelName, fields),
      { mode: 0o664 }
    )
    await fs.writeFile(join(srcDir, `${modelName}.module.ts`), moduleContent, {
      mode: 0o664
    })
    await fs.writeFile(
      join(srcDir, `${modelName}.resolver.ts`),
      resolverContent,
      { mode: 0o664 }
    )
    await fs.writeFile(
      join(srcDir, `${modelName}.service.ts`),
      serviceContent,
      { mode: 0o664 }
    )

    await this.updateDynamicModulesFile(modelName)
  }

  private generateModuleContent(modelName: string): string {
    return `
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ${modelName}Resolver } from './${modelName}.resolver';
    import { ${modelName}Service } from './${modelName}.service';
    import { ${modelName} } from './entity/${modelName}.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([${modelName}])],
      providers: [${modelName}Resolver, ${modelName}Service],
    })
    export class ${modelName}Module {}
    `
  }

  private generateResolverContent(modelName: string): string {
    return `
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { ${modelName}Service } from './${modelName}.service';
    import { ${modelName}InputDTO } from './dto/${modelName}Input.dto';
    import { ${modelName}DTO } from './dto/${modelName}.dto';

    @Resolver()
    export class ${modelName}Resolver {
      constructor(private readonly ${modelName.toLowerCase()}Service: ${modelName}Service) {}

      @Query(() => [${modelName}DTO])
      async ${modelName.toLowerCase()}s() {
        return this.${modelName.toLowerCase()}Service.findAll();
      }

      @Mutation(() => ${modelName}DTO)
      async create${modelName}(@Args('create${modelName}Input') create${modelName}Input: ${modelName}InputDTO) {
        return this.${modelName.toLowerCase()}Service.create(create${modelName}Input);
      }
    }
    `
  }

  private generateServiceContent(modelName: string): string {
    return `
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ${modelName}InputDTO } from './dto/${modelName}Input.dto';
    import { ${modelName}DTO } from './dto/${modelName}.dto';
    import { ${modelName} } from './entity/${modelName}.entity';

    @Injectable()
    export class ${modelName}Service {
      constructor(
        @InjectRepository(${modelName})
        private ${modelName.toLowerCase()}Repository: Repository<${modelName}>
      ) {}

       async create(create${modelName}Input: ${modelName}InputDTO): Promise<${modelName}DTO> {
         const ${modelName.toLowerCase()} = this.${modelName.toLowerCase()}Repository.create(create${modelName}Input);
         return this.${modelName.toLowerCase()}Repository.save(${modelName.toLowerCase()});
       }

      async findAll(): Promise<${modelName}[]> {
        return this.${modelName.toLowerCase()}Repository.find();
      }
  }
    `
  }

  private generateDtoContent(modelName: string, fields: any[]): string {
    const fieldsString = fields
      .map(field => `  ${this.generateDtoField(field, 'dto')}`)
      .join('\n')

    return `
    import { ObjectType, Field } from '@nestjs/graphql';

    ${this.generateSubDtoField(fields, 'dto')}

    @ObjectType()
    export class ${modelName}DTO {
      ${fieldsString}
    }
    `
  }

  private generateInputDtoContent(modelName: string, fields: any[]): string {
    const fieldsString = fields
      .map(field => `  ${this.generateDtoField(field, 'input')}`)
      .join('\n')

    return `
    import { InputType, Field } from '@nestjs/graphql';

    ${this.generateSubDtoField(fields, 'input')}

    @InputType()
    export class ${modelName}InputDTO {
      ${fieldsString}
    }
    `
  }

  private generateEntityContent(modelName: string, fields: any[]): string {
    const fieldsString = fields
      .map(field => `  ${this.generateEntityColumn(field)}`)
      .join('\n')

    return `
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

    @Entity()
    export class ${modelName} {
      @PrimaryGeneratedColumn()
      id: number;

      ${fieldsString}
    }
    `
  }

  private generateDtoField = (field: any, type: 'input' | 'dto') => {
    const isNullable = field?.required ? '' : 'nullable: true'

    switch (field?.type) {
      case 'text':
        return `@Field({${isNullable}})\n  ${field.name}: string;`
      case 'number':
        return `@Field({${isNullable}})\n  ${field.name}: number;`
      case 'date':
        return `@Field({${isNullable}})\n  ${field.name}: Date;`
      case 'tabs':
        return `@Field(() => [Tabs${type}Type], {nullable: true})\n  tabs?: Tabs${type}Type[];`
      default:
        return `@Field({${isNullable}})\n  ${field.name}: string;`
    }
  }

  private generateSubDtoField = (fields: any[], type: 'input' | 'dto') => {
    const decorator = type === 'input' ? '@InputType()' : '@ObjectType()'

    const subDtosString = fields?.map(field => {
      if (field?.type === 'tabs') {
        return `
        ${decorator}
        class Tabs${type}FieldsType {
         ${field.tabs
           .map(subField => {
             return subField?.fields?.map(subSubField => {
               return `${this.generateDtoField(subSubField, type)}`
             })
           })
           .flat()
           .join('\n')}
        }

        ${decorator}
        class Tabs${type}Type {
          ${field.tabs
            .map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _ =>
                `@Field({ nullable: true })\n  label: string; \n @Field(() => [Tabs${type}FieldsType], { nullable: true })\n fields?: Tabs${type}FieldsType[]`
            )
            .join('\n')}
          }
        `
      }
    })

    return subDtosString.join('\n')
  }

  private generateEntityColumn = (field: any) => {
    const isNullable = field?.required ? '' : 'nullable: true'

    switch (field?.type) {
      case 'text':
        return `@Column({${isNullable}})\n  ${field.name}: string;`
      case 'number':
        return `@Column({${isNullable}})\n  ${field.name}: number;`
      case 'date':
        return `@Column({${isNullable}})\n  ${field.name}: Date;`
      case 'tabs':
        return `@Column({${isNullable}, type: 'simple-json'})\n  tabs: any;`
      default:
        return `@Column({${isNullable}})\n  ${field.name}: string;`
    }
  }

  private async updateDynamicModulesFile(modelName: string) {
    const dynamicModulesFile = join(process.cwd(), 'src', 'dynamic-modules.ts')
    let dynamicModulesContent = ''

    try {
      dynamicModulesContent = await fs.readFile(dynamicModulesFile, 'utf-8')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
      dynamicModulesContent = `
import { ${modelName}Module } from './modules/${modelName}/${modelName}.module';

export const dynamicModules = [
  ${modelName}Module,
];
      `
      await fs.writeFile(dynamicModulesFile, dynamicModulesContent, {
        mode: 0o664
      })
      return
    }

    const importStatement = `import { ${modelName}Module } from './modules/${modelName.toLowerCase()}/${modelName}.module';`
    const moduleEntry = `  ${modelName}Module,`

    if (!dynamicModulesContent.includes(importStatement)) {
      const updatedContent = dynamicModulesContent
        .replace(/(export const dynamicModules = \[)/, `$1\n${moduleEntry}`)
        .replace(/(import .+;(\r?\n)*)*(\r?\n)*/, `$&${importStatement}\n`)

      await fs.writeFile(dynamicModulesFile, updatedContent, { mode: 0o664 })
    }
  }

  async deleteModule(modelName: string) {
    const srcDir = join(
      process.cwd(),
      'src',
      'modules',
      modelName.toLowerCase()
    )
    const distDir = join(
      process.cwd(),
      'dist',
      'modules',
      modelName.toLowerCase()
    )

    await fs.remove(srcDir)
    await fs.remove(distDir)

    await this.removeModuleFromDynamicModulesFile(modelName)
  }

  private async removeModuleFromDynamicModulesFile(modelName: string) {
    const dynamicModulesFile = join(process.cwd(), 'src', 'dynamic-modules.ts')
    let dynamicModulesContent = await fs.readFile(dynamicModulesFile, 'utf-8')

    const importStatement = `import { ${modelName}Module } from './modules/${modelName.toLowerCase()}/${modelName}.module';`
    const moduleEntry = `  ${modelName}Module,`

    if (dynamicModulesContent.includes(importStatement)) {
      dynamicModulesContent = dynamicModulesContent
        .replace(importStatement, '')
        .replace(moduleEntry, '')

      await fs.writeFile(dynamicModulesFile, dynamicModulesContent, {
        mode: 0o664
      })
    }
  }
}
