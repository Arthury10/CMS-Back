import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'

@Injectable()
export class ModuleGenerator {
  async generate(modelName: string, srcDir: string) {
    const moduleContent = this.generateModuleContent(modelName)

    await fs.writeFile(
      join(srcDir, `${modelName.toLowerCase()}.module.ts`),
      moduleContent,
      {
        mode: 0o664
      }
    )
  }

  private generateModuleContent(modelName: string): string {
    return `
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ${modelName}Resolver } from './${modelName.toLowerCase()}.resolver';
    import { ${modelName}Service } from './${modelName.toLowerCase()}.service';
    import { ${modelName} } from './entity/${modelName.toLowerCase()}.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([${modelName}])],
      providers: [${modelName}Resolver, ${modelName}Service],
    })
    export class ${modelName}Module {}
    `
  }
}
