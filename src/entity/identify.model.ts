const { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } =require("typeorm");

 class Contact {
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

module.exports=Contact;