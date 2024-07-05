import { Injectable, OnModuleInit } from '@nestjs/common'

import { DtoGenerator } from './file-generators/dto-generator'
import { EntityGenerator } from './file-generators/entity-generator'
import { ModuleGenerator } from './file-generators/module-generator'
import { ResolverGenerator } from './file-generators/resolver-generator'
import { ServiceGenerator } from './file-generators/service-generator'

import * as chokidar from 'chokidar'
import * as fs from 'fs-extra'
import { join } from 'path'
import { FieldsInputs } from 'src/core/dynamic-collections/dtos/fields.dto'

@Injectable()
export class DynamicModulesService implements OnModuleInit {
  async onModuleInit() {
    this.watchGeneratedFiles()
  }

  private watchGeneratedFiles() {
    const modulesDir = join(process.cwd(), 'src', 'modules')
    const watcher = chokidar.watch(`${modulesDir}/**/generated/fields.json`, {
      persistent: true
    })

    watcher
      .on('add', path => this.handleFileChange(path))
      .on('change', path => this.handleFileChange(path))
      .on('unlink', path => this.handleFileDeletion(path))
  }

  private async handleFileChange(filePath: string) {
    try {
      await this.updateCacheFile()
      console.log(`File ${filePath} has been changed`)
    } catch (error) {
      console.error(`Failed to handle file change: ${error.message}`)
    }
  }

  private async handleFileDeletion(filePath: string) {
    try {
      await this.updateCacheFile()
      console.log(`File ${filePath} has been deleted`)
    } catch (error) {
      console.error(`Failed to handle file deletion: ${error.message}`)
    }
  }

  constructor(
    private readonly dtoGenerator: DtoGenerator,
    private readonly entityGenerator: EntityGenerator,
    private readonly moduleGenerator: ModuleGenerator,
    private readonly resolverGenerator: ResolverGenerator,
    private readonly serviceGenerator: ServiceGenerator
  ) {}

  async createModule(modelName: string, fields: FieldsInputs[]) {
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
    await fs.ensureDir(join(srcDir, 'generated'))

    await this.dtoGenerator.generate(modelName, fields, srcDir)
    await this.entityGenerator.generate(modelName, fields, srcDir)
    await this.moduleGenerator.generate(modelName, srcDir)
    await this.resolverGenerator.generate(modelName, srcDir)
    await this.serviceGenerator.generate(modelName, srcDir)

    const fieldsContent = JSON.stringify({ modelName, fields }, null, 2)
    await fs.writeFile(
      join(srcDir, 'generated', 'fields.json'),
      fieldsContent,
      {
        mode: 0o664
      }
    )

    await this.updateDynamicModulesFile(modelName)
    await this.updateCacheFile()
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
      import { ${modelName}Module } from './modules/${modelName.toLowerCase()}/${modelName.toLowerCase()}.module';

      export const DynamicModules = [
        ${modelName}Module,
      ];
      `
      await fs.writeFile(dynamicModulesFile, dynamicModulesContent, {
        mode: 0o664
      })
      return
    }

    const importStatement = `import { ${modelName}Module } from './modules/${modelName.toLowerCase()}/${modelName.toLowerCase()}.module';`
    const moduleEntry = `  ${modelName}Module,`

    if (!dynamicModulesContent.includes(importStatement)) {
      const updatedContent = dynamicModulesContent
        .replace(/(export const DynamicModules = \[)/, `$1\n${moduleEntry}`)
        .replace(/(import .+;(\r?\n)*)*(\r?\n)*/, `$&${importStatement}\n`)

      await fs.writeFile(dynamicModulesFile, updatedContent, { mode: 0o664 })
    }
  }

  private async updateCacheFile() {
    const modulesDir = join(process.cwd(), 'src', 'modules')
    const collections = []
    const modules = await fs.readdir(modulesDir)

    for (const module of modules) {
      const fieldsPath = join(modulesDir, module, 'generated', 'fields.json')
      if (await fs.pathExists(fieldsPath)) {
        const fields = await fs.readJson(fieldsPath)
        collections.push(fields)
      }
    }

    const cachePath = join(
      process.cwd(),
      'src',
      'core',
      'dynamic-collections',
      'collections',
      'cache.json'
    )
    await fs.ensureFile(cachePath)
    await fs.writeJson(cachePath, collections, { spaces: 2 })
  }
}
