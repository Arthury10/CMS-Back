
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ProdutosInputDTO } from './dto/ProdutosInput.dto';
    import { ProdutosDTO } from './dto/Produtos.dto';
    import { Produtos } from './entity/Produtos.entity';

    @Injectable()
    export class ProdutosService {
      constructor(
        @InjectRepository(Produtos)
        private produtosRepository: Repository<Produtos>
      ) {}

       async create(createProdutosInput: ProdutosInputDTO): Promise<ProdutosDTO> {
         const produtos = this.produtosRepository.create(createProdutosInput);
         return this.produtosRepository.save(produtos);
       }

      async findAll(): Promise<Produtos[]> {
        return this.produtosRepository.find();
      }
  }
    