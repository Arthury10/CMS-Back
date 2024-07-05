import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'

const GraphQLModuleConfig = GraphQLModule.forRoot<ApolloDriverConfig>({
  driver: ApolloDriver,
  autoSchemaFile: 'src/schema.gql',
  playground: true,
  introspection: true,
  sortSchema: true
})

export default GraphQLModuleConfig
