
    import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

    @Entity()
    export class Page {
      @PrimaryGeneratedColumn()
      id: number;

        @Column({nullable: true})
  name: string;
  @Column({nullable: true})
  description: string;
  @Column({nullable: true})
  publishAt: Date;
    }
    