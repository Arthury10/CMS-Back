
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { PageInputDTO } from './dto/pageInput.dto';
    import { PageDTO } from './dto/page.dto';
    import { Page } from './entity/page.entity';

    @Injectable()
    export class PageService {
      constructor(
        @InjectRepository(Page)
        private pageRepository: Repository<Page>
      ) {}

      async findMany(): Promise<Page[]> {
        return await this.pageRepository.find();
      }

      async findOne(id: number): Promise<Page> {
        return await this.pageRepository.findOne({where: {id}});
      }

      async createOne(createPageInput: PageInputDTO): Promise<PageDTO> {
        const page = this.pageRepository.create(createPageInput)
        return await this.pageRepository.save(page)
      }
      
      async updateOne(id:number, updatePageInput: PageInputDTO): Promise<PageDTO> {
        const page =  await this.pageRepository.update(id, updatePageInput)
        return this.findOne(id)
      }

      async removeOne(id:number): Promise<PageDTO> {
        const page = await this.findOne(id)
        await this.pageRepository.delete(id)
        return page
      }  
  }
    