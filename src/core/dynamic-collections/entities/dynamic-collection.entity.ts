import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DynamicCollection {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number
}
