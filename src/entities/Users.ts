import { Exclude } from 'class-transformer';
import {
	Column,
	Entity,
	Generated,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Users', { schema: 'dbo' })
export class Users {
	@Exclude({ toPlainOnly: true })
	@PrimaryGeneratedColumn({
		type: 'integer',
		name: 'id',
	})
	id: number;

	@Column('uuid', {
		nullable: false,
		name: 'idx',
	})
	@Generated('uuid')
	idx: string | null;

	

	@Column('varchar', {
		nullable: false,
		length: 150,
		name: 'contact_name',
	})
	contact_name: string;


	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'password',
	})
	password: string;

	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'email',
	})
	email: string | null;

	@Exclude({ toPlainOnly: true })
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'address',
	})
	address: string | null;

	@Column('varchar', {
		nullable: true,
		length: 50,
		name: 'phone_number',
	})
	phone_number: string | null;



	@Column('varchar', {
		nullable: true,
		length: 10,
		name: 'phone_ext',
	})
	phone_ext: string | null;



	@Column('datetime', {
		nullable: false,
		name: 'created_on',
		default: () => 'CURRENT_TIMESTAMP()',
	})
	created_on: Date;

	@Column('boolean', {
		nullable: false,
		name: 'is_active',
		default: () => 'true',
	})
	is_active: boolean;

	@Exclude({ toPlainOnly: true })
	@Column('boolean', {
		nullable: false,
		name: 'is_admin',
		default: () => 'false',
	})
	is_admin: boolean;


	@Exclude({ toPlainOnly: true })
	@Column('boolean', {
		nullable: false,
		name: 'is_obsolete',
		default: () => 'false',
	})
	is_obsolete: boolean;

	@Column('varchar', {
		nullable: true,
		length: 400,
		name: 'location',
	})
	location: string | null;

	

	constructor(
		contact_name?: string,
		email?: string,
		is_superadmin?: boolean,
	) {
		this.contact_name = contact_name || '';
		this.email = email || '';
		this.is_admin = is_superadmin || false;
	}
}
