
    import { ObjectType, Field } from '@nestjs/graphql';

    



        @ObjectType()
        class ProdutosTabsdtoFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @ObjectType()
        class ProdutosTabsdtoType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [ProdutosTabsdtoFieldsType], { nullable: true })
 fields?: ProdutosTabsdtoFieldsType[]
          }
        

    @ObjectType()
    export class ProdutosDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [ProdutosTabsdtoType], {nullable: true})
  tabs?: ProdutosTabsdtoType[];
    }
    