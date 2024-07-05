import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'

import { FieldsInputs } from './dtos/fields.dto'

import { promises as fs } from 'fs'
import { join } from 'path'
import { EntityManager, QueryRunner } from 'typeorm'
import * as vm from 'vm'

@Injectable()
export class DynamicCollectionsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager
  ) {}

  async createOrUpdateModel(
    modelName: string,
    fields: FieldsInputs[]
  ): Promise<boolean> {
    const queryRunner = this.entityManager.connection.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // Verifica se a tabela já existe
      const tableExists = await queryRunner.hasTable(modelName)
      if (!tableExists) {
        // Cria uma nova tabela
        await this.createTable(queryRunner, modelName, fields)
      } else {
        // Atualiza a tabela existente
        await this.updateTable(queryRunner, modelName, fields)
      }

      await queryRunner.commitTransaction()
      await this.generateCollectionsFile(modelName, fields)
      return true
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    } finally {
      await queryRunner.release()
    }
  }

  private async createTable(
    queryRunner: QueryRunner,
    modelName: string,
    fields: FieldsInputs[]
  ) {
    let columns = fields
      .map(field => this.mapFieldToColumnDefinition(field))
      .join(', ')
    columns = `id SERIAL PRIMARY KEY, ${columns}`
    await queryRunner.query(`CREATE TABLE ${modelName} (${columns})`)
  }

  private async updateTable(
    queryRunner: QueryRunner,
    modelName: string,
    fields: FieldsInputs[]
  ) {
    for (const field of fields) {
      const columnDefinition = this.mapFieldToColumnDefinition(field)
      await queryRunner.query(
        `ALTER TABLE ${modelName} ADD COLUMN IF NOT EXISTS ${columnDefinition}`
      )
    }
  }

  private mapFieldToColumnDefinition(field: FieldsInputs): string {
    switch (field.type) {
      case 'text':
        return `${field.name} VARCHAR(255)`
      case 'number':
        return `${field.name} INT`
      case 'date':
        return `${field.name} TIMESTAMP`
      case 'checkbox':
        return `${field.name} BOOLEAN`
      case 'relationship':
        return field.relationship.hasMany
          ? `${field.name} INT[]`
          : `${field.name} INT`
      default:
        throw new Error(`Unsupported field type: ${field.type}`)
    }
  }

  async generateCollectionsFile(modelName: string, fields: FieldsInputs[]) {
    const content = `\nexport const ${modelName} = ${JSON.stringify(fields, null, 2)};`

    const srcDir = join(
      process.cwd(),
      'src',
      'modules',
      'dynamic-collections',
      'collections'
    )

    try {
      const writeFile = async (dir: string, path: string) => {
        try {
          await fs.access(dir)
        } catch {
          await fs.mkdir(dir, { recursive: true })
        }
        await fs.writeFile(path, content)
      }

      await writeFile(srcDir, join(srcDir, `${modelName}.ts`))
    } catch (error) {
      console.error(`Error writing file: ${error}`)
      throw new Error(`Failed to write collections file: ${error.message}`)
    }
  }

  async getCollection(modelName: string) {
    const srcDir = join(
      process.cwd(),
      'src',
      'core',
      'dynamic-collections',
      'collections',
      `${modelName}.ts`
    )

    try {
      const content = await fs.readFile(srcDir, 'utf-8')
      const removedExport = content.replace(`export const ${modelName} = `, '')

      const script = new vm.Script(removedExport)
      const context = vm.createContext({})
      const result = script.runInContext(context)
      return result
    } catch (error) {
      console.error(`Error reading file: ${error}`)
      throw new Error(`Failed to read collections file: ${error.message}`)
    }
  }
}
