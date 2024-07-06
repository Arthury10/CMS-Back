import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import { DynamicModulesService } from '../dynamic-modules/dynamic-modules.service'
import { FieldsInputs } from './dtos/fields.dto'
import { DynamicCollectionsService } from './dynamic-collections.service'
import { DynamicCollection } from './entities/dynamic-collection.entity'

import { GraphQLJSONObject } from 'graphql-type-json'

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
    return true
  }

  @Query(() => [GraphQLJSONObject])
  async getCollection(
    @Args('modelName', { nullable: true }) modelName: string
  ): Promise<string> {
    return await this.dynamicCollectionsService.getCollections(modelName)
  }
}
