
    import { InputType, Field } from '@nestjs/graphql';

    



        @InputType()
        class ArthurTabsinputFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @InputType()
        class ArthurTabsinputType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [ArthurTabsinputFieldsType], { nullable: true })
 fields?: ArthurTabsinputFieldsType[]
          }
        

    @InputType()
    export class ArthurInputDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [ArthurTabsinputType], {nullable: true})
  tabs?: ArthurTabsinputType[];
    }
    