import {IsNotEmpty,IsEmail,Length,IsNumberString,IsString,} from 'class-validator';


export class LoginDto {

	@IsNotEmpty({ message: 'gmail must not be empty'})
	@IsEmail()
    email: string;


	@IsNotEmpty({ message: 'password must not be empty'})
    @Length(8, 8, { message: 'Password must be of Length 8 characters' })
    @IsString()
    password: string;
}