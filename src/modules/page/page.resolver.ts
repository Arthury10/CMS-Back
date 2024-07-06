
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { PageService } from './page.service';
    import { PageInputDTO } from './dto/pageInput.dto';
    import { PageDTO } from './dto/page.dto';

    @Resolver()
    export class PageResolver {
      constructor(private readonly pageService: PageService) {}

      @Query(() => [PageDTO])
      async findManyPages() {
        return this.pageService.findMany()
      }
    
      @Query(() => [PageDTO])
      async findOnePage(
        @Args('id') id: number
      ) {
        return this.pageService.findOne(id)
      }  

      @Mutation(() => PageDTO)
      async createOnePage(@Args('createPageInput') createPageInput: PageInputDTO) {
        return this.pageService.createOne(createPageInput)
      }

      @Mutation(() => PageDTO)
      async updateOnePage(
        @Args('id') id: number,
        @Args('updatePageInput') updatePageInput: PageInputDTO
        ) {
        return this.pageService.updateOne(id, updatePageInput)
      }

      @Mutation(() => PageDTO)
      async removeOnePage(
        @Args('id') id: number,
        ) {
        return this.pageService.removeOne(id)
      }
    }
    