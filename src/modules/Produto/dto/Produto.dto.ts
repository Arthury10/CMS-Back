
    import { ObjectType, Field } from '@nestjs/graphql';

    



        @ObjectType()
        class TabsdtoFieldsType {
         @Field({nullable: true})
  valor: string;
        }


        @ObjectType()
        class TabsdtoType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [TabsdtoFieldsType], { nullable: true })
 fields?: TabsdtoFieldsType[]
          }
        

    @ObjectType()
    export class ProdutoDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [TabsdtoType], {nullable: true})
  tabs?: TabsdtoType[];
    }
    