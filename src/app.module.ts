import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

// import {
//   DynamicCollectionsModule,
//   DynamicModulesModule
// } from 'lib_test_arthur_cms'
import {
  DynamicCollectionsModule,
  DynamicModulesModule
} from '../lib_test_arthur_CMS/src'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import GraphQLModuleConfig from './config/graphql'
import TypeOrmModuleConfig from './config/typeorm'
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
