
    import { ObjectType, Field } from '@nestjs/graphql';

    



        @ObjectType()
        class ArthurTabsdtoFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @ObjectType()
        class ArthurTabsdtoType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [ArthurTabsdtoFieldsType], { nullable: true })
 fields?: ArthurTabsdtoFieldsType[]
          }
        

    @ObjectType()
    export class ArthurDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [ArthurTabsdtoType], {nullable: true})
  tabs?: ArthurTabsdtoType[];
    }
    