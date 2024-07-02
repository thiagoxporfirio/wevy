import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { User } from './User';

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
	user: User;

	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;
}
