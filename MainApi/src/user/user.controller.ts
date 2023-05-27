import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('/signup')
  create(@Body() createUserDto: CreateUserDto) {
    Logger.log('user signup');
    return this.userService.create(createUserDto);
  }

  @Get('')
  findOne(@Request() req: any) {
    Logger.log('user findOne');
    return this.userService.findByIdToReturn(req.user.id);
  }

  @Delete()
  remove(@Request() req: any) {
    Logger.log('user remove');
    return this.userService.remove(req.user.id);
  }
}
