import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpStatus,
  HttpException,
  Put,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { QueryUserDto } from "./dto/query-user.dto";
import { BlockUserDto } from "./dto/block-user.dto";
import { User } from "./schemas/user.schema";
//import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.userService.create(createUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to create user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get("search")
  async search(@Query() queryUserDto: QueryUserDto) {
    return this.userService.search(queryUserDto);
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      return user;
    } catch (error) {
      throw new HttpException(
        error.message || "User not found",
        HttpStatus.NOT_FOUND
      );
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Patch(":id")
  async update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      return await this.userService.update(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to update user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Param("id") id: string) {
    try {
      await this.userService.remove(id);
      return { message: "User deleted successfully" };
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to delete user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Post(":id/follow")
  async follow(@Param("id") id: string, @Body("userId") userId: string) {
    try {
      return await this.userService.follow(id, userId);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to follow user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  //@UseGuards(JwtAuthGuard)
  @Delete(":id/follow")
  async unfollow(@Param("id") id: string, @Body("userId") userId: string) {
    try {
      return await this.userService.unfollow(id, userId);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to unfollow user",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(":id/followers")
  async getFollowers(
    @Param("id") id: string,
    @Query() queryUserDto: QueryUserDto
  ) {
    try {
      return await this.userService.getFollowers(id, queryUserDto.page);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to get followers",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(":id/following")
  async getFollowing(
    @Param("id") id: string,
    @Query() queryUserDto: QueryUserDto
  ) {
    try {
      return await this.userService.getFollowing(id, queryUserDto.page);
    } catch (error) {
      throw new HttpException(
        error.message || "Failed to get following",
        HttpStatus.BAD_REQUEST
      );
    }
  }
  @Post(":id/block")
  async blockUser(
    @Param("id") id: string,
    @Body()
    blockUserDto: BlockUserDto
  ): Promise<User | null> {
    return this.userService.blockUser(id, blockUserDto);
  }
  @Post(":id/unblock")
  unblockUser(
    @Param("id") id: string,
    @Body()
    blockUserDto: BlockUserDto
  ): Promise<User | null> {
    return this.userService.unblockUser(id, blockUserDto);
  }
}
