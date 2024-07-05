import { Field, InputType } from '@nestjs/graphql'

import { FieldsInputs } from '../fields.dto'

@InputType()
export class TabField {
  @Field()
  label: string

  @Field(() => [FieldsInputs])
  fields: FieldsInputs[]
}
