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

@Entity('Books', { schema: 'dbo' })
export class Books {
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
		name: 'title',
	})
	title: string;


	
	@Column('varchar', {
		nullable: true,
		length: 150,
		name: 'author',
	})
	author: string | null;

    @Column('varchar', {
		nullable: true,
		length: 150,
		name: 'pages',
	})
	pages: string | null;


    @Column('varchar', {
		nullable: true,
		length: 250,
		name: 'path',
	})
	path: string | null;


	@Exclude({ toPlainOnly: true })
	@Column('boolean', {
		nullable: false,
		name: 'is_obsolete',
		default: () => 'false',
	})
	is_obsolete: boolean;

	@Column('datetime', {
		nullable: false,
		name: 'created_on',
		default: () => 'CURRENT_TIMESTAMP()',
	})
	created_on: Date;

}
