
    import { ObjectType, Field } from '@nestjs/graphql';

    



        @ObjectType()
        class TesteTabsdtoFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @ObjectType()
        class TesteTabsdtoType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [TesteTabsdtoFieldsType], { nullable: true })
 fields?: TesteTabsdtoFieldsType[]
          }
        

    @ObjectType()
    export class TesteDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [TesteTabsdtoType], {nullable: true})
  tabs?: TesteTabsdtoType[];
    }
    