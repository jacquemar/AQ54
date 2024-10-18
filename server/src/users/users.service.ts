import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email }
      ]
    });

    

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Créer le nouvel utilisateur
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // Sauvegarder l'utilisateur dans la base de données
    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username } });
  }

  
}