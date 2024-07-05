
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ArthurInputDTO } from './dto/ArthurInput.dto';
    import { ArthurDTO } from './dto/Arthur.dto';
    import { Arthur } from './entity/Arthur.entity';

    @Injectable()
    export class ArthurService {
      constructor(
        @InjectRepository(Arthur)
        private arthurRepository: Repository<Arthur>
      ) {}

       async create(createArthurInput: ArthurInputDTO): Promise<ArthurDTO> {
         const arthur = this.arthurRepository.create(createArthurInput);
         return this.arthurRepository.save(arthur);
       }

      async findAll(): Promise<Arthur[]> {
        return this.arthurRepository.find();
      }
  }
    