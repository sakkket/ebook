import { IsOptional } from 'src/common/customOptional';
import { Transform } from 'class-transformer';
import {
	IsBoolean,
	IsEmail,
	IsIn,
	IsNotEmpty,
	IsNumberString,
	IsString,
	Length,
	ValidateIf,
	IsUUID
} from 'class-validator';
import { EndsWith } from 'src/common/Endswith';

/**
 *
 *
 * @export
 * @class CreateUser
 */
export class CreateUser {
	@IsNotEmpty({ message: 'Contact name is missing' })
	@IsString()
	@Length(4, 100, {
		message: 'Contact name must be between 4 to 100 characters long',
	})
	contact_name: string;


	@IsNotEmpty({ message: 'Email is missing' })
	@IsEmail({}, { message: 'Email is invalid' })
	@EndsWith({ message: 'Email must end with orbispay.me' })
	@Length(10, 64, {
		message: 'Email must be between 10 to 64 characters long',
	})
	@Transform(({ value }) => value.toLowerCase(), { toClassOnly: true })
	email: string;

	
	@IsNotEmpty({ message: 'password must not be empty'})
    @Length(8, 8, { message: 'Password must be of Length 8 characters' })
    @IsString()
    password: string;
	

	
	@IsOptional()
	@IsString({ message: 'Address must be string' })
	@Length(5, 30, {
		message: 'Address must be between 5 to 30 characters long',
	})
	address?: string;

	
	@IsOptional()
	@IsString({ message: 'phoone number must be string' })
	phone_number?: string;

	

}
