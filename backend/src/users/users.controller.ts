import {
  Controller,
  Get,
  Req,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { FindUsersDto } from './dto/find-users-dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string) {
    return this.usersService.findOptions({
      where: { username },
    });
  }

  @Post('find')
  findUsersByQuery(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto.query);
  }

  @Patch('me')
  update(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(req.user.id, updateUserDto);
  }

  @Get('me/wishes')
  getMeWishes(@Req() req) {
    return this.usersService.findWishesUser(req.user.username);
  }

  @Get(':username/wishes')
  getWishesByUsername(@Param('username') username: string) {
    return this.usersService.findWishes(username);
  }
}
