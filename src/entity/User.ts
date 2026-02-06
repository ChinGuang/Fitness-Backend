import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Unique } from "typeorm"

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true,
  })
  name!: string

  @Column()
  password!: string

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt: Date | undefined;
}
