import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserEntity } from './interfaces/user-entity.interface';
import { UserEntityResponse } from './responses/user-entity.response';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  public async currentUser(@User() user: IUserEntity): Promise<UserEntityResponse> {
    return new UserEntityResponse(user);
  }
}