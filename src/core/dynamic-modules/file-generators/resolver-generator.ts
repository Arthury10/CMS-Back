import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'

@Injectable()
export class ResolverGenerator {
  async generate(modelName: string, srcDir: string) {
    const resolverContent = this.generateResolverContent(modelName)

    await fs.writeFile(
      join(srcDir, `${modelName.toLowerCase()}.resolver.ts`),
      resolverContent,
      { mode: 0o664 }
    )
  }

  private generateResolverContent(modelName: string): string {
    return `
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { ${modelName}Service } from './${modelName.toLowerCase()}.service';
    import { ${modelName}InputDTO } from './dto/${modelName.toLowerCase()}Input.dto';
    import { ${modelName}DTO } from './dto/${modelName.toLowerCase()}.dto';

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
}
