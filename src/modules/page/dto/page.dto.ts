
    import { ObjectType, Field } from '@nestjs/graphql';

    



    @ObjectType()
    export class PageDTO {
        @Field({nullable: true})
  name: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  publishAt: Date;
    }
    