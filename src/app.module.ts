import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/Users';
import { Books } from './entities/book';
import { Subscription } from './entities/subscriptions'; 
import { TokenModule } from './token/token.module'; 
import { join } from 'path';
import * as typeormConfig from './ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    TypeOrmModule.forFeature([Users,Books,Subscription]),
    TokenModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
