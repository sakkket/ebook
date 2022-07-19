import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Books } from './entities/book';
import { Subscription } from './entities/subscriptions'; 
import { join } from 'path';


const typeormConfig: TypeOrmModuleOptions = {
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: 'rootme99',
	database: 'ebook',
	entities: [Users,Books,Subscription],
	migrationsRun: true,
	migrations: [join(__dirname, 'migrations/**/*{.ts,.js}')],
	synchronize: false,
	
	
  }
export = typeormConfig;
