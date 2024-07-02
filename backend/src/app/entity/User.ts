import {
	Column,
	Entity,
	JoinColumn, OneToMany,
	OneToOne,
	PrimaryGeneratedColumn, Relation
} from "typeorm";
import { Contacts } from "./Contacts";
import { Attorneys } from "./Attorneys";
import { Addresses } from "./Addresses";
import { Click } from "./Clicks";

@Entity("users")
export class User {
	@OneToMany(() => Contacts, contacts => contacts.user)
	contacts: Contacts[];

	@OneToOne(() => Attorneys, attorney => attorney.user)
	attorney: Attorneys;

	@OneToOne(() => Addresses, address => address.user)
	address: Addresses;

	@OneToMany(() => Click, click => click.user)
    clicks: Click[];

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	cpf_cnpj: string;

	@Column({ unique: true })
	email: string;

	@Column({ nullable: true })
	email_verified_at: Date;

	@Column()
	password_reset_count: number;

	@Column()
	password: string;

	@Column()
	photo: string;

	@Column({ nullable: true })
	remember_token: string | undefined;

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@Column({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP"
	})
	updated_at: Date;
}
