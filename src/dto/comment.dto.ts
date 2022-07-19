import {IsNotEmpty,IsEmail,Length,IsNumberString,IsString,} from 'class-validator';


export class CommentDTO {

	@IsNotEmpty({ message: 'Idx must not be empty'})
	@IsString()
    bookIdx: string;


    @IsNotEmpty({ message: 'Comment must not be empty'})
	@IsString()
    comment: string;

}