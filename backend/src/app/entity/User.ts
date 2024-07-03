import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	CreateDateColumn,
	UpdateDateColumn
  } from "typeorm";
  import { Task } from "./Task";
  
  @Entity("users")
  export class User {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column()
	name: string;
  
	@Column({ unique: true })
	email: string;
  
	@Column()
	password: string;
  
	@OneToMany(() => Task, task => task.user)
	tasks: Task[];
  
	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;
  
	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;
  }
  