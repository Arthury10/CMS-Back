
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { TesteInputDTO } from './dto/TesteInput.dto';
    import { TesteDTO } from './dto/Teste.dto';
    import { Teste } from './entity/Teste.entity';

    @Injectable()
    export class TesteService {
      constructor(
        @InjectRepository(Teste)
        private testeRepository: Repository<Teste>
      ) {}

       async create(createTesteInput: TesteInputDTO): Promise<TesteDTO> {
         const teste = this.testeRepository.create(createTesteInput);
         return this.testeRepository.save(teste);
       }

      async findAll(): Promise<Teste[]> {
        return this.testeRepository.find();
      }
  }
    