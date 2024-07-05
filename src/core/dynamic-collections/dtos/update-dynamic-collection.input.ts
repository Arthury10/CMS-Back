import { Field, InputType, Int, PartialType } from '@nestjs/graphql'

import { CreateDynamicCollectionInput } from './create-dynamic-collection.input'

@InputType()
export class UpdateDynamicCollectionInput extends PartialType(
  CreateDynamicCollectionInput
) {
  @Field(() => Int)
  id: number
}
