import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'
import { FieldsInputs } from 'src/core/dynamic-collections/dtos/fields.dto'

@Injectable()
export class DtoGenerator {
  async generate(modelName: string, fields: FieldsInputs[], srcDir: string) {
    const dtoContent = this.generateDtoContent(modelName, fields)
    const inputDtoContent = this.generateInputDtoContent(modelName, fields)

    await fs.writeFile(
      join(srcDir, 'dto', `${modelName.toLowerCase()}.dto.ts`),
      dtoContent,
      {
        mode: 0o664
      }
    )
    await fs.writeFile(
      join(srcDir, 'dto', `${modelName.toLowerCase()}Input.dto.ts`),
      inputDtoContent,
      { mode: 0o664 }
    )

    return {
      dtoContent,
      inputDtoContent
    }
  }

  private generateDtoContent(
    modelName: string,
    fields: FieldsInputs[]
  ): string {
    const fieldsString = fields
      .map(field => `  ${this.generateDtoField(modelName, field, 'dto')}`)
      .join('\n')

    return `
    import { ObjectType, Field } from '@nestjs/graphql';

    ${this.generateSubDtoField(modelName, fields, 'dto')}

    @ObjectType()
    export class ${modelName}DTO {
      ${fieldsString}
    }
    `
  }

  private generateInputDtoContent(
    modelName: string,
    fields: FieldsInputs[]
  ): string {
    const fieldsString = fields
      .map(field => `  ${this.generateDtoField(modelName, field, 'input')}`)
      .join('\n')

    return `
    import { InputType, Field } from '@nestjs/graphql';

    ${this.generateSubDtoField(modelName, fields, 'input')}

    @InputType()
    export class ${modelName}InputDTO {
      ${fieldsString}
    }
    `
  }

  private generateDtoField = (
    modelName: string,
    field: FieldsInputs,
    type: 'input' | 'dto'
  ) => {
    const isNullable = field?.required ? '' : 'nullable: true'

    switch (field?.type) {
      case 'text':
        return `@Field({${isNullable}})\n  ${field.name}: string;`
      case 'number':
        return `@Field({${isNullable}})\n  ${field.name}: number;`
      case 'date':
        return `@Field({${isNullable}})\n  ${field.name}: Date;`
      case 'tabs':
        return `@Field(() => [${modelName}Tabs${type}Type], {nullable: true})\n  tabs?: ${modelName}Tabs${type}Type[];`
      default:
        return `@Field({${isNullable}})\n  ${field.name}: string;`
    }
  }

  private generateSubDtoField = (
    modelName: string,
    fields: FieldsInputs[],
    type: 'input' | 'dto'
  ) => {
    const decorator = type === 'input' ? '@InputType()' : '@ObjectType()'

    const subDtosString = fields?.map(field => {
      if (field?.type === 'tabs') {
        return `
        ${decorator}
        class ${modelName}Tabs${type}FieldsType {
         ${field.tabs
           .map(subField => {
             return subField?.fields?.map(subSubField => {
               return `${this.generateDtoField(modelName, subSubField, type)}`
             })
           })
           .flat()
           .join('\n')}
        }

        ${decorator}
        class ${modelName}Tabs${type}Type {
          ${field.tabs
            .map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              _ =>
                `@Field({ nullable: true })\n  label: string; \n @Field(() => [${modelName}Tabs${type}FieldsType], { nullable: true })\n fields?: ${modelName}Tabs${type}FieldsType[]`
            )
            .join('\n')}
          }
        `
      }
    })

    return subDtosString.join('\n')
  }
}
