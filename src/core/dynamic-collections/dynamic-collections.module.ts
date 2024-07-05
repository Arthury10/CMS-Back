import { Module } from '@nestjs/common'

import { DynamicCollectionsResolver } from './dynamic-collections.resolver'
import { DynamicCollectionsService } from './dynamic-collections.service'

import { DynamicModulesService } from 'src/services/dynamic-modules.service'

@Module({
  imports: [],
  providers: [
    DynamicCollectionsResolver,
    DynamicCollectionsService,
    DynamicModulesService
  ],
  exports: [DynamicCollectionsResolver, DynamicCollectionsService]
})
export class DynamicCollectionsModule {}
