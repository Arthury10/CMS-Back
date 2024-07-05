
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ProdutoInputDTO } from './dto/ProdutoInput.dto';
    import { ProdutoDTO } from './dto/Produto.dto';
    import { Produto } from './entity/Produto.entity';

    @Injectable()
    export class ProdutoService {
      constructor(
        @InjectRepository(Produto)
        private produtoRepository: Repository<Produto>
      ) {}

       async create(createProdutoInput: ProdutoInputDTO): Promise<ProdutoDTO> {
         const produto = this.produtoRepository.create(createProdutoInput);
         return this.produtoRepository.save(produto);
       }

      async findAll(): Promise<Produto[]> {
        return this.produtoRepository.find();
      }
  }
    