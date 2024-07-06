
    import { InputType, Field } from '@nestjs/graphql';

    



    @InputType()
    export class PageInputDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
    }
    