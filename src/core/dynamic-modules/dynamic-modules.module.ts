import { Global, Module } from '@nestjs/common'

import { DynamicModulesResolver } from './dynamic-modules.resolver'
import { DynamicModulesService } from './dynamic-modules.service'
import { DtoGenerator } from './file-generators/dto-generator'
import { EntityGenerator } from './file-generators/entity-generator'
import { ModuleGenerator } from './file-generators/module-generator'
import { ResolverGenerator } from './file-generators/resolver-generator'
import { ServiceGenerator } from './file-generators/service-generator'

@Global()
@Module({
  imports: [],
  providers: [
    DynamicModulesResolver,
    DynamicModulesService,
    DtoGenerator,
    EntityGenerator,
    ModuleGenerator,
    ResolverGenerator,
    ServiceGenerator
  ],
  exports: [DynamicModulesResolver, DynamicModulesService]
})
export class DynamicModulesModule {}
