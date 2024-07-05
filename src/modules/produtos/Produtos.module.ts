
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ProdutosResolver } from './Produtos.resolver';
    import { ProdutosService } from './Produtos.service';
    import { Produtos } from './entity/Produtos.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Produtos])],
      providers: [ProdutosResolver, ProdutosService],
    })
    export class ProdutosModule {}
    