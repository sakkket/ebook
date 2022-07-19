import { Exclude } from 'class-transformer';
import { Users } from './Users';
import { Books } from './book';
import {
	Column,
	Entity,
	Generated,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
    OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Subscription', { schema: 'dbo' })
export class Subscription {
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
		nullable: true,
		length: 150,
		name: 'comment',
	})
	comment: string;


	
	@Exclude({ toPlainOnly: true })
	@Column('boolean', {
		nullable: true,
		name: 'has_liked',
	})
	has_liked: boolean;

    @Column('varchar', {
		nullable: true,
		length: 150,
		name: 'current_page',
	})
	current_page: string;


    @OneToOne(() => Users)
	@JoinColumn()
	user: Users;


    @OneToOne(() => Books)
	@JoinColumn()
	book: Books;


	@Exclude({ toPlainOnly: true })
	@Column('boolean', {
		nullable: false,
		name: 'is_obsolete',
		default: () => 'false',
	})
	is_obsolete: boolean;



}
