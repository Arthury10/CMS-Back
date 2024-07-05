import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { FieldsInputs } from './dtos/fields.dto'
import { DynamicCollectionsService } from './dynamic-collections.service'
import { DynamicCollection } from './entities/dynamic-collection.entity'

import { GraphQLJSONObject } from 'graphql-type-json'
import { DynamicModulesService } from 'src/services/dynamic-modules.service'

@Resolver(() => DynamicCollection)
export class DynamicCollectionsResolver {
  constructor(
    private readonly dynamicModulesService: DynamicModulesService,
    private readonly dynamicCollectionsService: DynamicCollectionsService
  ) {}

  @Mutation(() => Boolean)
  async createOrUpdateModel(
    @Args('modelName') modelName: string,
    @Args('fields', { type: () => [FieldsInputs] }) fields: FieldsInputs[]
  ): Promise<boolean> {
    await this.dynamicModulesService.createModule(modelName, fields)
    await this.dynamicCollectionsService.generateCollectionsFile(
      modelName,
      fields
    )
    return true
  }

  @Query(() => [GraphQLJSONObject])
  async getCollection(
    @Args('collectionName') collectionName: string
  ): Promise<string> {
    return await this.dynamicCollectionsService.getCollection(collectionName)
  }
}
