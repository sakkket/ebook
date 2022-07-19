import { Users } from 'src/entities/Users';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectRepository(Users)
		private readonly usersRepo: Repository<Users>,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: 'SECRET!@',
			ignoreExpiration: false,
		});
	}

	async validate(payload: { idx: string }): Promise<Users> {
		const { idx } = payload;
		const user = await this.usersRepo.findOne({
			where: { idx, is_active: true, is_obsolete: false },
		});
		if (!user) {
			throw new UnprocessableEntityException('User not found');
		}

		return user;
	}
}
