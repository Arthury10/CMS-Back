import { Resolver } from '@nestjs/graphql'

import { DynamicModulesService } from './dynamic-modules.service'

@Resolver()
export class DynamicModulesResolver {
  constructor(private readonly dynamicModulesService: DynamicModulesService) {}
}
