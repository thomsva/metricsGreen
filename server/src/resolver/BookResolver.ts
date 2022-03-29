import { Query, Resolver } from 'type-graphql';
import { AppDataSource } from '../data-source';
import Book from '../entity/Book';

const bookRepository = AppDataSource.getRepository(Book);

@Resolver()
export class BookResolver {
  @Query(() => [Book], { description: 'Get all the books.' })
  async books(): Promise<Book[]> {
    return await bookRepository.find();
  }
}
