import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('me')
  async getMe(@Req() req: { user: { _id: string } }) {
    const user = await this.usersService.findById(req.user._id);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    return user;
  }
}
