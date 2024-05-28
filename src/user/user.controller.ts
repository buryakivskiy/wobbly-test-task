import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IUserEntity } from './interfaces/user-entity.interface';
import { UserEntityResponse } from './responses/user-entity.response';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntityResponse })
  @ApiOperation({ description: 'Get current user' })
  @ApiHeader({name: 'Authorization', description: 'JWT token'})
  public async currentUser(@User() user: IUserEntity): Promise<UserEntityResponse> {
    return new UserEntityResponse(user);
  }
}