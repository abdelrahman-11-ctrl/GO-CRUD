import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async addUser(body: CreateUserDto) {
    const email = body.email.toLowerCase().trim();
    const exist = await this.userModel.findOne({ email });
    if (exist) {
      throw new ConflictException('User already exists');
    }
    const hashed = await bcrypt.hash(body.password, 10);
    const newUser = new this.userModel({ ...body, email, password: hashed });
    await newUser.save();
    return newUser;
  }
  async findByEmail(email: string) {
    return this.userModel
      .findOne({ email: email.toLowerCase().trim() })
      .select('+password');
  }
  async findById(id: string) {
    return this.userModel.findById(id);
  }
 async findByIdWithPassword(id:string){
return await this.userModel.findById(id).select('+password')
  }
  
}
