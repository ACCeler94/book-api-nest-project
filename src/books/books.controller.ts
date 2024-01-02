import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Get('/')
  getAll() {
    return this.booksService.getAllBooks();
  }

  @Get('/:id')
  async getBookById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<any> {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Book not found.');
    return book;
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createBook(@Body() bookData: CreateBookDTO) {
    return this.booksService.createBook(bookData);
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async addToFav(
    @Body('bookId', new ParseUUIDPipe()) bookId: string,
    @Request() req,
  ) {
    const userId = req.user.id; // take userId from the request since the user needs to be logged in anyway and data will be valid
    const book = await this.booksService.getById(bookId);
    if (!book) throw new NotFoundException('Book not found.');
    await this.booksService.addToFav(bookId, userId);
    return { success: true };
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async updateBook(
    @Param('id', new ParseUUIDPipe()) id: 'string',
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id))) {
      throw new NotFoundException('Book not found');
    }
    await this.booksService.updateBook(id, bookData);
    return { success: true };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(
    @Param('id', new ParseUUIDPipe()) id: 'string',
  ): Promise<any> {
    const book = await this.booksService.getById(id);
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    await this.booksService.deleteById(id);
    return { success: true };
  }
}
