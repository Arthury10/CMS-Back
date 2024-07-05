
    import { InputType, Field } from '@nestjs/graphql';

    



        @InputType()
        class TesteTabsinputFieldsType {
         @Field({nullable: true})
  valor: string;
        }

        @InputType()
        class TesteTabsinputType {
          @Field({ nullable: true })
  label: string; 
 @Field(() => [TesteTabsinputFieldsType], { nullable: true })
 fields?: TesteTabsinputFieldsType[]
          }
        

    @InputType()
    export class TesteInputDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
  @Field(() => [TesteTabsinputType], {nullable: true})
  tabs?: TesteTabsinputType[];
    }
    