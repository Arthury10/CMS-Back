
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ArthurResolver } from './Arthur.resolver';
    import { ArthurService } from './Arthur.service';
    import { Arthur } from './entity/Arthur.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Arthur])],
      providers: [ArthurResolver, ArthurService],
    })
    export class ArthurModule {}
    