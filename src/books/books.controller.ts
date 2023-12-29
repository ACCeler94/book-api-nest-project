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
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';

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
  async createBook(@Body() bookData: CreateBookDTO) {
    return this.booksService.createBook(bookData);
  }

  @Put('/:id')
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
