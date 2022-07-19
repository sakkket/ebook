import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TokensService } from './tokens.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users'; 
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([ Users]),
		JwtModule.register({
			secret: 'SECRET!@' ,
			signOptions: {
				expiresIn: 900,
			},
		}),
	],
	controllers: [],
	providers: [TokensService, JwtStrategy],
	exports: [TokensService],
})
export class TokenModule {}
