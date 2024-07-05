
    import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
    import { TesteService } from './Teste.service';
    import { TesteInputDTO } from './dto/TesteInput.dto';
    import { TesteDTO } from './dto/Teste.dto';

    @Resolver()
    export class TesteResolver {
      constructor(private readonly testeService: TesteService) {}

      @Query(() => [TesteDTO])
      async testes() {
        return this.testeService.findAll();
      }

      @Mutation(() => TesteDTO)
      async createTeste(@Args('createTesteInput') createTesteInput: TesteInputDTO) {
        return this.testeService.create(createTesteInput);
      }
    }
    