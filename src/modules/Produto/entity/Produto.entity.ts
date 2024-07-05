
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

    @Entity()
    export class Produto {
      @PrimaryGeneratedColumn()
      id: number;

        @Column({nullable: true})
  name: string;
  @Column({nullable: true})
  description: string;
  @Column({nullable: true})
  publishAt: Date;
  @Column({nullable: true, type: 'simple-json'})
  tabs: any;
    }
    