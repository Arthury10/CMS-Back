
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { ProdutoService } from './Produto.service';
    import { ProdutoInputDTO } from './dto/ProdutoInput.dto';
    import { ProdutoDTO } from './dto/Produto.dto';

    @Resolver()
    export class ProdutoResolver {
      constructor(private readonly produtoService: ProdutoService) {}

      @Query(() => [ProdutoDTO])
      async produtos() {
        return this.produtoService.findAll();
      }

      @Mutation(() => ProdutoDTO)
      async createProduto(@Args('createProdutoInput') createProdutoInput: ProdutoInputDTO) {
        return this.produtoService.create(createProdutoInput);
      }
    }
    