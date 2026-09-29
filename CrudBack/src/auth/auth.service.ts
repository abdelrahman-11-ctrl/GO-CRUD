import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../users/create-user.dto';
import { LoginDto } from './login.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async register(body: CreateUserDto) {
    const user = await this.userService.addUser(body);
    const token = this.jwtService.sign({ _id: user._id.toString() });
    return {
      message: 'registered successfully',
      token,
      user: { _id: user._id, name: user.name, email: user.email },
    };
  }

  async login(body: LoginDto) {
    const exist = await this.userService.findByEmail(body.email);
    if (!exist) {
      throw new UnauthorizedException('invalid password or email');
    }
    const isMatch = await bcrypt.compare(body.password, exist.password);
    if (!isMatch) {throw new UnauthorizedException('invalid password or email');}
    const token = this.jwtService.sign({ _id: exist._id.toString() });

    return {
      message: 'logged in successfully',
      token,
      user: { _id: exist._id, name: exist.name, email: exist.email },
    };
  }
}
