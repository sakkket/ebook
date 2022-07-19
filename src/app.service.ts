import { Injectable } from '@nestjs/common';
import { Users } from './entities/Users';
import { Books } from './entities/book';
import { Subscription } from './entities/subscriptions';
import { LoginDto } from './dto/Login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import {HttpException,HttpStatus,UnauthorizedException,BadRequestException} from '@nestjs/common';
import { TokensService} from './token/tokens.service';
import * as bcrypt from 'bcrypt';
import { BookIdxDto } from './dto/BookIdx.dto';
import { CreateUser } from './dto/CreateUser.dto';
import { hash, argon2d } from 'argon2';
import * as argon from 'argon2';
import { find } from 'rxjs';
import { CommentDTO } from './dto/comment.dto';
import { UserLocationDTO } from './dto/UserLocation.dto';

@Injectable()
export class AppService {

  constructor(
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(Books)
    private readonly booksRepo: Repository<Books>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    private tokenService : TokensService,
    
    ){}



  async login(userDto: LoginDto) {

		userDto.password = unescape(userDto.password); //decoding the encoded special characters over http request
		const user = await this.usersRepo.findOne({
			where: {
				email: userDto.email,
				is_obsolete: false,
			},
		  });
		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		if (user.is_obsolete) {
			throw new BadRequestException('Invalid credentials');
		}




		if (user) {
			if (user.password === '' || !user.password) {
				throw new HttpException('Password not set', HttpStatus.BAD_REQUEST);
			}
			if (await argon.verify(user.password, userDto.password)) {
				if (!user.is_active) {
					throw new UnauthorizedException(
						'Account was locked due to multiple failed logins',
					);
				}
				

					const accessToken = await this.tokenService.generateAccessToken(user);
			
					const {idx, contact_name, email,is_admin} = user;
					const response = {
						idx, contact_name, email,is_admin
					}
				
					return { message: 'Successfully signed in', accessToken, user:response }; 

					
				}
				else{
					throw new UnauthorizedException(
						"Invalid credentials"
					);
				}

		}
	}

  async createUser(user: CreateUser, userRequesting: Users): Promise<any> {
    let userIdx: string;
    const userExists = await this.usersRepo.findOne({
      where: {
        is_obsolete: false,
        email:user.email
      }
    });

    if (userExists) {
      throw new HttpException(
        'User with given email already exists',
        HttpStatus.CONFLICT,
      );
    }
   
    
    if(userRequesting.is_admin === false){
      throw new HttpException(
        'Non admin user cannot create user',
        HttpStatus.NOT_FOUND,
      );
    }

	const pwdHash = await this.hashPasswd(user.password);
	user["password"] = pwdHash

	const userId = await this.usersRepo.save(user);
	userIdx = userId.idx;

    return { statusCode: 200, message: 'User created', data: { userIdx } };
  
  }

  async uploadBook(file:any,user:Users,body:any){

	if(user.is_admin === false){
		throw new HttpException(
		  'Non admin user cannot upload a book',
		  HttpStatus.NOT_FOUND,
		);
	  }
	
	if (!file) {
		return { statusCode: HttpStatus.BAD_REQUEST, message: 'Please upload a file'};
	}
	const book = new Books();
	book.title = body.title
	book.path = file.originalname;
	book.author = body.author;
	book.pages = body.pages
	await this.booksRepo.save(book);

	return { statusCode: 200, message: 'Book uploaded Successfully' };
}

  async getAllBooks(user:Users){
    const books = await this.booksRepo.find({
      where: {
        is_obsolete: false,
      }
    });
    if(!books){
      return "No books found"
    }
    return books;
  }

  async subscribeBook(user:Users,book:BookIdxDto){
    const findbook = await this.booksRepo.findOne({
			where: {
				idx: book.idx,
				is_obsolete: false,
			},
	});
	if(user.is_admin){
		throw new HttpException(
			'Admin user cannot subscribe to a book',
			HttpStatus.CONFLICT,
		);
	}
	if(!findbook){
		throw new HttpException(
			'Book not found',
			HttpStatus.NOT_FOUND,
		);
	}
	const subscriptionExist =  await this.subscriptionRepo.findOne({
		where: {
			user: user,
			book:findbook,
			is_obsolete: false,
		},
	});
	if(subscriptionExist){
		throw new HttpException(
			'User has already subscribed book',
			HttpStatus.CONFLICT,
		);
	}

	const subscription = new Subscription();
	subscription.book = findbook;
	subscription.user = user;
	subscription.is_obsolete = false;
	const id = await this.subscriptionRepo.save(subscription);
	return { statusCode:200,"message": "Subscription Successful" ,}

  }

async  hashPasswd(str: string): Promise<string> {
    return hash(str, {
      type: argon2d,
      hashLength: 50,
      saltLength: 32,
      timeCost: 4,
    });
}

async getBookDetails(user:Users,book:BookIdxDto){
    const books = await this.booksRepo.find({
      where: {
		idx:book.idx,
        is_obsolete: false,
      }
    });
    if(!books){
      return "No books found"
    }

	const bookInfo =  await this.subscriptionRepo.find({
		where: {
		  book:books,	
		  is_obsolete: false,
		  user: Not(user)
		},
		relations: ['user'],
	  });
	let payload = []
	  if(bookInfo){
		bookInfo.forEach((book)=>{
			payload.push({
				user: book.user.contact_name,
				current_page: book.current_page,
				comment:book.comment
			})
		})
	  }
	 
    return payload;
  }

async commentOnAbook(user:Users,commentDTO:CommentDTO){
    const findbook = await this.booksRepo.findOne({
			where: {
				idx: commentDTO.bookIdx,
				is_obsolete: false,
			},
	});
	if(user.is_admin){
		throw new HttpException(
			'Admin user cannot comment on a book',
			HttpStatus.CONFLICT,
		);
	}
	if(!findbook){
		throw new HttpException(
			'Book not found',
			HttpStatus.NOT_FOUND,
		);
	}
	const subscriptionExist =  await this.subscriptionRepo.findOne({
		where: {
			user: user,
			book:findbook,
			is_obsolete: false,
		},
	});
	if(!subscriptionExist){
		throw new HttpException(
			'User has not subscribed to the book',
			HttpStatus.CONFLICT,
		);
	}

	await this.subscriptionRepo.update(
		{ idx: subscriptionExist.idx },
		{ comment: commentDTO.comment },
	);
	return { statusCode:200,"message": "Comment added to the book" ,}

  }

  async updateUserLocation(user:Users,userlocation:UserLocationDTO){

	

	await this.usersRepo.update(
		{ idx: user.idx },
		{ location: userlocation.latitude + " "+userlocation.longitude },
	);
	return { statusCode:200,"message": "Location is saved for the user" }

  }

  async userStatusInfo(user:Users){
	if(!user.is_admin){
		throw new HttpException(
			'Non Admin user cannot acess user other location',
			HttpStatus.CONFLICT,
		);
	}

	const bookInfo =  await this.subscriptionRepo.find({
		where: {
		  is_obsolete: false,
		},
		relations: ['user','book'],
	  });

	let payload = []
		if(bookInfo){
			bookInfo.forEach((book)=>{
				payload.push({
					user: book.user.contact_name,
					current_page: book.current_page,
					comment:book.comment,
					location:book.user.location,
					bookInfo:book.book
				})
			})
		}
	 
    return payload;

  }

  async ebookStatus(user:Users,book:BookIdxDto){
	if(!user.is_admin){
		throw new HttpException(
			'Non Admin user cannot check for book status',
			HttpStatus.CONFLICT,
		);
	}
    const books = await this.booksRepo.find({
      where: {
		idx:book.idx,
        is_obsolete: false,
      }
    });
    if(!books){
      return "No books found"
    }

	const bookInfo =  await this.subscriptionRepo.find({
		where: {
		  book:books,	
		  is_obsolete: false,
		},
		relations: ['user','book'],
	  });
	let payload = []
	  if(bookInfo){
		bookInfo.forEach((book)=>{
			payload.push({
				user: book.user.contact_name,
				current_page: book.current_page,
				comment:book.comment,
				author:book.book.author,
				bookLocation:'./Documents/books'+book.book.pages,
				has_liked:book.has_liked
				

			})
		})
	  }
	 
    return {statusCode:200,bookStatus:payload,totalSubscrition:bookInfo.length};
  }


}
