import { Injectable, Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { User, CreateUserDto } from './types/user.type';

@Injectable()
export class UsersRepository {
  constructor(@Inject('KNEX_CONNECTION') private readonly knex: Knex) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.knex('users')
      .where({ email })
      .first();
  }

  async findById(id: number): Promise<User | undefined> {
    return this.knex('users')
      .where({ id })
      .first();
  }

  async create(userData: CreateUserDto): Promise<User> {
    const [user] = await this.knex('users')
      .insert({
        ...userData,
        created_at: new Date(),
      })
      .returning('*');
    
    return user;
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.knex('users')
      .where({ id: userId })
      .update({ last_login: new Date() });
  }
}