import { AddBookService } from './addbook.service';
import { Controller } from '@nestjs/common';

@Controller('/add')
export class AddBookController {
  constructor(readonly addBookService: AddBookService) {}
}
