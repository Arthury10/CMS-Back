import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'

@Injectable()
export class ServiceGenerator {
  async generate(modelName: string, srcDir: string) {
    const serviceContent = this.generateServiceContent(modelName)

    await fs.writeFile(
      join(srcDir, `${modelName.toLowerCase()}.service.ts`),
      serviceContent,
      { mode: 0o664 }
    )
  }

  private generateServiceContent(modelName: string): string {
    return `
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ${modelName}InputDTO } from './dto/${modelName.toLowerCase()}Input.dto';
    import { ${modelName}DTO } from './dto/${modelName.toLowerCase()}.dto';
    import { ${modelName} } from './entity/${modelName.toLowerCase()}.entity';

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
}
