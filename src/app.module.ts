import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import GraphQLModuleConfig from './config/graphql'
import TypeOrmModuleConfig from './config/typeorm'
import { dynamicModules } from './dynamic-modules'
import { DynamicCollectionsModule } from './core/dynamic-collections/dynamic-collections.module'
import { DynamicModulesService } from './services/dynamic-modules.service'

import { readdirSync } from 'fs'
import { join } from 'path'

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
export class AppModule {
  static forRoot(): DynamicModule {
    const dynamicModules = AppModule.loadDynamicModules()
    return {
      module: AppModule,
      imports: [...dynamicModules]
    }
  }

  private static loadDynamicModules(): DynamicModule[] {
    const dynamicModulesPath = join(__dirname, 'modules')
    const dynamicModules = readdirSync(dynamicModulesPath, {
      withFileTypes: true
    })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => {
        const moduleName = dirent.name
        return require(
          join(dynamicModulesPath, moduleName, `${moduleName}.module`)
        )[`${moduleName}Module`]
      })

    return dynamicModules
  }
}
