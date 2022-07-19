import { Controller, Get,Post,Body,UseGuards,UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { Users } from './entities/Users';
import { GetUser } from './common/GetUser.decorator';
import { LoginDto } from './dto/Login.dto';
import { JwtAuthGuard } from './common/JwtGuard';
import { CreateUser } from './dto/CreateUser.dto';
import { BookIdxDto } from './dto/BookIdx.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedFile } from '@nestjs/common';
import { Express } from 'express'
import { diskStorage } from  'multer';
import { CommentDTO } from './dto/comment.dto';
import { UserLocationDTO } from './dto/UserLocation.dto';

@Controller('ebook')
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post('login')
  public async loginCSP(
    @Body() loginDto: LoginDto,
  ): Promise<any> {
    return await this.appService.login(loginDto);
  }


  @UseGuards(JwtAuthGuard)
  @Post('create-user')
  async createUser(
    @Body() userData: CreateUser,
    @GetUser() userRequesting: Users,
  ): Promise<any> {
    return this.appService.createUser(userData, userRequesting);
  }


	@UseGuards(JwtAuthGuard)
	@Post('book-upload')
	@UseInterceptors(FileInterceptor('file',
	{
        storage: diskStorage({
		destination: './Documents/books', 
          filename: (req, file, cb) => {
			const fileExtension = file.originalname.split('.').pop();
			file.originalname =  "Book-"+Date.now() +'.'+fileExtension;
          return cb(null, file.originalname)
        }
        })
    }))
	async uploadFile(
		@GetUser() user: Users,
		@Body() body: any,
		@UploadedFile() file: Express.Multer.File)
		{
		return this.appService.uploadBook(file,user,body)
	
	}

 @UseGuards(JwtAuthGuard)
	@Get('all-books')
	async getAllBooks(
		@GetUser() user: Users,
	): Promise<any> {
		return this.appService.getAllBooks(user);
	}

  @UseGuards(JwtAuthGuard)
	@Post('subscribe')
	async subscribeBook(
	@GetUser() user: Users,
    @Body() booksIdx: BookIdxDto,
	): Promise<any> {
		return this.appService.subscribeBook(user,booksIdx);
	}



	@UseGuards(JwtAuthGuard)
	@Get('getBookDetails')
	async getBookDetails(
	@GetUser() user: Users,
    @Body() booksIdx: BookIdxDto,
	): Promise<any> {
		return this.appService.getBookDetails(user,booksIdx);
	}


	@UseGuards(JwtAuthGuard)
	@Post('commentOnAbook')
	async commentOnAbook(
	@GetUser() user: Users,
    @Body() commentDTO: CommentDTO,
	): Promise<any> {
		return this.appService.commentOnAbook(user,commentDTO);
	}


	@UseGuards(JwtAuthGuard)
	@Post('updateUserLocation')
	async updateUserLocation(
	@GetUser() user: Users,
    @Body() userLocationDTO: UserLocationDTO,
	): Promise<any> {
		return this.appService.updateUserLocation(user,userLocationDTO);
	}


	@UseGuards(JwtAuthGuard)
	@Get('userStatusInfo')
	async userStatusInfo(
	@GetUser() user: Users,
	): Promise<any> {
		return this.appService.userStatusInfo(user);
	}



	@UseGuards(JwtAuthGuard)
	@Post('ebookStatus')
	async ebookStatus(
	@GetUser() user: Users,
	@Body() booksIdx: BookIdxDto,
	): Promise<any> {
		return this.appService.ebookStatus(user,booksIdx);
	}






}
