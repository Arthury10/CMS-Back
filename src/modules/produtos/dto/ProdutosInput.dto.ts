
    import { InputType, Field } from '@nestjs/graphql';

    



        @InputType()
        class ProdutosTabsinputFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @InputType()
        class ProdutosTabsinputType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [ProdutosTabsinputFieldsType], { nullable: true })
 fields?: ProdutosTabsinputFieldsType[]
          }
        

    @InputType()
    export class ProdutosInputDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [ProdutosTabsinputType], {nullable: true})
  tabs?: ProdutosTabsinputType[];
    }
    