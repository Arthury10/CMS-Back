
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { TesteResolver } from './Teste.resolver';
    import { TesteService } from './Teste.service';
    import { Teste } from './entity/Teste.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Teste])],
      providers: [TesteResolver, TesteService],
    })
    export class TesteModule {}
    