import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber!: string |null;

  @Column({ type: 'varchar', nullable: true })
  email!:string|null;

  @Column({ type: 'int', nullable: true })
  linkedId!: number |null;

  @Column({ default: "primary" })
  linkPrecedence!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date | null;
}
