import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import GraphQLModuleConfig from './config/graphql'
import TypeOrmModuleConfig from './config/typeorm'
import { DynamicCollectionsModule } from './core/dynamic-collections/dynamic-collections.module'
import { DynamicModulesModule } from './core/dynamic-modules/dynamic-modules.module'
import { DynamicModules } from './dynamic-modules'

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModuleConfig,
    GraphQLModuleConfig,
    DynamicCollectionsModule,
    DynamicModulesModule,
    ...DynamicModules
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
