
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { PageResolver } from './page.resolver';
    import { PageService } from './page.service';
    import { Page } from './entity/page.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Page])],
      providers: [PageResolver, PageService],
    })
    export class PageModule {}
    