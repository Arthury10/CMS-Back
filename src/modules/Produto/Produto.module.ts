
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ProdutoResolver } from './Produto.resolver';
    import { ProdutoService } from './Produto.service';
    import { Produto } from './entity/Produto.entity';

    @Module({
      imports: [TypeOrmModule.forFeature([Produto])],
      providers: [ProdutoResolver, ProdutoService],
    })
    export class ProdutoModule {}
    