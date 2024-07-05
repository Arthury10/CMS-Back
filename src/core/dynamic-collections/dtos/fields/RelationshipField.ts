import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class RelationshipField {
  @Field()
  relationTo: string

  @Field(() => Boolean, { nullable: true })
  hasMany?: boolean
}
