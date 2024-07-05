import { Field, InputType } from '@nestjs/graphql'

import { FieldsInputs } from '../fields.dto'

@InputType()
export class BlockField {
  @Field()
  label: string

  @Field(() => [FieldsInputs])
  fields: FieldsInputs[]
}
