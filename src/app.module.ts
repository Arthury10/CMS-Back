import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import GraphQLModuleConfig from './config/graphql'
import TypeOrmModuleConfig from './config/typeorm'
import { DynamicCollectionsModule } from './core/dynamic-collections/dynamic-collections.module'
import { dynamicModules } from './dynamic-modules'
import { DynamicModulesService } from './services/dynamic-modules.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModuleConfig,
    GraphQLModuleConfig,
    DynamicCollectionsModule,
    ...dynamicModules
  ],
  controllers: [AppController],
  providers: [AppService, DynamicModulesService]
})
export class AppModule {}
