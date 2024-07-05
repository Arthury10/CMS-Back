import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'
import { FieldsInputs } from 'src/core/dynamic-collections/dtos/fields.dto'

@Injectable()
export class EntityGenerator {
  async generate(modelName: string, fields: FieldsInputs[], srcDir: string) {
    const entityContent = this.generateEntityContent(modelName, fields)

    await fs.writeFile(
      join(srcDir, 'entity', `${modelName.toLowerCase()}.entity.ts`),
      entityContent,
      { mode: 0o664 }
    )

    return entityContent
  }

  private generateEntityContent(
    modelName: string,
    fields: FieldsInputs[]
  ): string {
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

  private generateEntityColumn = (field: FieldsInputs) => {
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
}
