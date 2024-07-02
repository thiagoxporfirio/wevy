import {
	Column,
	Entity,
	OneToMany,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn
} from "typeorm";
import { Task } from './Task';

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

	@Column({ nullable: true })
	remember_token: string | undefined;

	@CreateDateColumn({ type: "timestamp" })
	created_at: Date;

	@UpdateDateColumn({ type: "timestamp" })
	updated_at: Date;
}
