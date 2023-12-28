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
import { AuthorsService } from './authors.service';
import { CreateAuthorDTO } from './dtos/create-author.dto';
import { UpdateAuthorDTO } from './dtos/update-author.dto';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  @Get('/')
  getAll() {
    return this.authorsService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: 'string'): Promise<any> {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    return author;
  }

  @Post('/')
  create(@Body() authorData: CreateAuthorDTO) {
    return this.authorsService.createAuthor(authorData);
  }

  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: 'string',
    @Body() authorData: UpdateAuthorDTO,
  ) {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.editAuthor(id, authorData);
    return { success: true };
  }

  @Delete('/:id')
  async deleteById(
    @Param('id', new ParseUUIDPipe()) id: 'string',
  ): Promise<any> {
    const author = await this.authorsService.getById(id);
    if (!author) {
      throw new NotFoundException('Author not found');
    }
    await this.authorsService.deleteById(id);
    return { success: true };
  }
}
