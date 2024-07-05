import { Field, Float, InputType, Int } from '@nestjs/graphql'

import { FieldInputEnum } from '../enums/FieldInput.enum'
import { BlockField } from './fields/BlockField'
import { RelationshipField } from './fields/RelationshipField'
import { SelectOption } from './fields/SelectOption'
import { TabField } from './fields/TabField'

@InputType()
export class FieldsInputs {
  @Field({ nullable: true })
  name?: string

  @Field(() => FieldInputEnum)
  type: FieldInputEnum

  @Field({ nullable: true })
  label?: string

  @Field({ nullable: true })
  required?: boolean

  @Field({ nullable: true })
  defaultValue?: string

  @Field(() => [SelectOption], { nullable: true })
  options?: SelectOption[]

  @Field(() => RelationshipField, { nullable: true })
  relationship?: RelationshipField

  @Field(() => [FieldsInputs], { nullable: true })
  fields?: FieldsInputs[]

  @Field(() => [TabField], { nullable: true })
  tabs?: TabField[]

  @Field(() => [BlockField], { nullable: true })
  blocks?: BlockField[]

  @Field(() => Int, { nullable: true })
  min?: number

  @Field(() => Int, { nullable: true })
  max?: number

  @Field(() => Float, { nullable: true })
  step?: number

  @Field({ nullable: true })
  readOnly?: boolean

  @Field({ nullable: true })
  hidden?: boolean

  @Field({ nullable: true })
  position?: string
}
