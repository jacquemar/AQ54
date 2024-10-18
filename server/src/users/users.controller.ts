import { Controller, Get, Post, Body, UseGuards, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto)
      const { password, ...result } = user;
      return result;
      console.log("1 utilisateur enregistré:" ,result)
    } catch (error) {
      // Gérer les erreurs, par exemple si l'utilisateur existe déjà
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }

  //@Get()
 //findAll() {
    //return this.usersService.findAll();
  //}

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  //@Patch(':id')
  //update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    //return this.usersService.update(+id, updateUserDto);
  //}

  //@Delete(':id')
  //remove(@Param('id') id: string) {
    //return this.usersService.remove(+id);
  //}
}
