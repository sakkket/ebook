import {IsNotEmpty,IsEmail,Length,IsNumberString,IsString,} from 'class-validator';


export class UserLocationDTO {

	@IsNotEmpty({ message: 'Latitude must not be empty'})
	@IsString()
    latitude: string;


    @IsNotEmpty({ message: 'Longitude must not be empty'})
	@IsString()
    longitude: string;

}