import { TypeOrmModule } from '@nestjs/typeorm'

const TypeOrmModuleConfig = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'CMS_back',
  password: process.env.POSTGRES_PASSWORD || 'CMS_back_PASSWORD',
  database: process.env.POSTGRES_NAME || 'CMS_back_db',
  synchronize: true,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}']
})

export default TypeOrmModuleConfig
