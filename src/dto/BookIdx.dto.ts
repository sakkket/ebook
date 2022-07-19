import {IsNotEmpty,IsEmail,Length,IsNumberString,IsString,} from 'class-validator';


export class BookIdxDto {

	@IsNotEmpty({ message: 'Idx must not be empty'})
	@IsString()
    idx: string;

	

}