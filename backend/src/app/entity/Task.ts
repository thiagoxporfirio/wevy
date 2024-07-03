import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn
  } from "typeorm";
  import { User } from "./User";
  
  @Entity("tasks")
  export class Task {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column()
	title: string;
  
	@Column({ nullable: true })
	description: string;
  
	@Column({ default: false })
	completed: boolean;
  
	@ManyToOne(() => User, user => user.tasks)
	@JoinColumn({ name: "user_id" })
	user: User;
  
	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;
  
	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;
  }
  