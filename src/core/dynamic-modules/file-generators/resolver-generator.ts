import { Injectable } from '@nestjs/common'

import * as fs from 'fs-extra'
import { join } from 'path'
import { pluralize } from 'src/utilities/pluralize'

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
      async findMany${pluralize(modelName)}() {
        return this.${modelName.toLowerCase()}Service.findMany()
      }
    
      @Query(() => [${modelName}DTO])
      async findOne${modelName}(
        @Args('id') id: number
      ) {
        return this.${modelName.toLowerCase()}Service.findOne(id)
      }  

      @Mutation(() => ${modelName}DTO)
      async createOne${modelName}(@Args('create${modelName}Input') create${modelName}Input: ${modelName}InputDTO) {
        return this.${modelName.toLowerCase()}Service.createOne(create${modelName}Input)
      }

      @Mutation(() => ${modelName}DTO)
      async updateOne${modelName}(
        @Args('id') id: number,
        @Args('update${modelName}Input') update${modelName}Input: ${modelName}InputDTO
        ) {
        return this.${modelName.toLowerCase()}Service.updateOne(id, update${modelName}Input)
      }

      @Mutation(() => ${modelName}DTO)
      async removeOne${modelName}(
        @Args('id') id: number,
        ) {
        return this.${modelName.toLowerCase()}Service.removeOne(id)
      }
    }
    `
  }
}
