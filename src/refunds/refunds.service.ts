import { RefundsRepository } from './refunds.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefundsService {
  constructor(private readonly refundsRepository: RefundsRepository) {}

  find() {
    return '';
  }
  findOne() {
    return '';
  }
  create() {
    return '';
  }
  updateOne() {
    return '';
  }
  deleteOne() {
    return '';
  }
}
