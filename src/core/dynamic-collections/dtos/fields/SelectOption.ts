import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SelectOption {
  @Field()
  label: string

  @Field()
  value: string
}
