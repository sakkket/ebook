import { Users } from 'src/entities/Users';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { SignOptions } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

const BASE_OPTIONS: SignOptions = {
	issuer: 'orbis',
	audience: 'orbis',
};

export interface RefreshTokenPayload {
	jti: number;
	sub: number;
}

@Injectable()
export class TokensService {
	private readonly jwt: JwtService;

	public constructor(
		jwt: JwtService,
		@InjectRepository(Users)
		private readonly userRepo: Repository<Users>,
	) {
		this.jwt = jwt;
	}

	public async generateAccessToken(user: Users): Promise<string> {
		const opts: SignOptions = {
			...BASE_OPTIONS,
			expiresIn: 900,
			subject: String(user.id),
		};

		return this.jwt.signAsync({ ...this.pickCustomerFields(user) }, opts);
	}

	

	

	

	public pickCustomerFields(user: Users) {
		const userFields = {
			'id': user['id'],
			'idx': user['idx'],
			'email': user['email']
		}
		return userFields;
	}
}
