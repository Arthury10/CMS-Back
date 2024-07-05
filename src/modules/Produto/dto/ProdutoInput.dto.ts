
    import { InputType, Field } from '@nestjs/graphql';

    



        @InputType()
        class TabsinputFieldsType {
         @Field({nullable: true})
  valor: string;
        }


        @InputType()
        class TabsinputType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [TabsinputFieldsType], { nullable: true })
 fields?: TabsinputFieldsType[]
          }
        

    @InputType()
    export class ProdutoInputDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [TabsinputType], {nullable: true})
  tabs?: TabsinputType[];
    }
    