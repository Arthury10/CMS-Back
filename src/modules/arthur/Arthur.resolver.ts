
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { ArthurService } from './Arthur.service';
    import { ArthurInputDTO } from './dto/ArthurInput.dto';
    import { ArthurDTO } from './dto/Arthur.dto';

    @Resolver()
    export class ArthurResolver {
      constructor(private readonly arthurService: ArthurService) {}

      @Query(() => [ArthurDTO])
      async arthurs() {
        return this.arthurService.findAll();
      }

      @Mutation(() => ArthurDTO)
      async createArthur(@Args('createArthurInput') createArthurInput: ArthurInputDTO) {
        return this.arthurService.create(createArthurInput);
      }
    }
    