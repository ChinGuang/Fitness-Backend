import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Gender } from "../models/member.interface";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({
    unique: true
  })
  phone!: string;

  @OneToOne(() => Profile, { cascade: true, eager: true })
  @JoinColumn()
  profile!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.UNKNOWN
  })
  gender!: Gender;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;
}
