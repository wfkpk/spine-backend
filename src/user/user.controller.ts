import { Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserAuthGuard } from 'src/auth/auth.guard';
import { FirebaseAuthGuard } from 'src/auth/firebase-auth.guard';
import { Post, Body, Headers, Request } from '@nestjs/common';
import { Response } from 'src/interface/response';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { EditRequestDto } from './dto/edit-request.dto';
@Controller('u')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('/test')
  getHello() {
    return {
      data: 'hello',
    };
  }
  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get()
  async getUser(@Request() req): Promise<Response> {
    const userId = req.headers['userId'];
    const user = await this.userService.getUser(userId);
    return {
      data: user,
    };
  }
  @UseGuards(FirebaseAuthGuard)
  @Post('/create')
  async createUser(
    @Headers('Authorization') authHeader: string,
    @Body() createUserDto: CreateUserDto,
  ): Promise<Response> {
    const authToken = authHeader.replace('Bearer ', '');
    return {
      data: await this.userService.createUser(createUserDto, authToken),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Patch('/update')
  @ApiOperation({ summary: 'Update Profile' })
  @ApiResponse({ status: 200, description: 'Update Was Successful' })
  async updateUser(
    @Request() req: any,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.userService.updateUser(updateUserDto, userId),
    };
  }

  @UseGuards(FirebaseAuthGuard, UserAuthGuard)
  @Get('/notes')
  @ApiOperation({ summary: 'Get Notes' })
  @ApiResponse({ status: 200, description: 'Get Notes Was Successful' })
  async getNotes(@Request() req: any): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.userService.getNotes(userId),
    };
  }

  @UseGuards()
  @Post('/book-edit-request')
  async bookEditRequest(
    @Request() req: any,
    @Body() editRequestDto: EditRequestDto,
  ): Promise<Response> {
    const userId = req.headers['userId'];
    return {
      data: await this.userService.bookEditRequest(editRequestDto, userId),
    };
  }
}
