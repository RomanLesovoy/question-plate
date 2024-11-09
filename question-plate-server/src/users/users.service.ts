import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User, CreateUserDto } from './types/user.type';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }

  async create(userData: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return this.usersRepository.create(userData);
  }

  async incrementPoints(userId: number, points: number): Promise<void> {
    const userPoints = await this.usersRepository.findPoints(userId);
    await this.usersRepository.updatePoints(userId, userPoints + points);
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.usersRepository.updateLastLogin(userId);
  }
}
