import { Global, Module } from '@nestjs/common'

import { DynamicCollectionsResolver } from './dynamic-collections.resolver'
import { DynamicCollectionsService } from './dynamic-collections.service'

@Global()
@Module({
  imports: [],
  providers: [DynamicCollectionsResolver, DynamicCollectionsService],
  exports: [DynamicCollectionsResolver, DynamicCollectionsService]
})
export class DynamicCollectionsModule {}
