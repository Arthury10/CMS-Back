
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { ProdutosService } from './Produtos.service';
    import { ProdutosInputDTO } from './dto/ProdutosInput.dto';
    import { ProdutosDTO } from './dto/Produtos.dto';

    @Resolver()
    export class ProdutosResolver {
      constructor(private readonly produtosService: ProdutosService) {}

      @Query(() => [ProdutosDTO])
      async produtoss() {
        return this.produtosService.findAll();
      }

      @Mutation(() => ProdutosDTO)
      async createProdutos(@Args('createProdutosInput') createProdutosInput: ProdutosInputDTO) {
        return this.produtosService.create(createProdutosInput);
      }
    }
    