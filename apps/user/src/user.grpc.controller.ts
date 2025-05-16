import { Controller } from "@nestjs/common";
import { GrpcMethod, RpcException } from "@nestjs/microservices";
import { UserService } from "./user.service";
import { status } from "@grpc/grpc-js";

@Controller()
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod("UserService", "CreateUser")
  async createUser(data: CreateUserRequest) {
    try {
      return await this.userService.create(data);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to create user",
      });
    }
  }

  @GrpcMethod("UserService", "GetUser")
  async getUser(data: GetUserRequest) {
    try {
      const user = await this.userService.findOne(data.id);
      if (!user) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: "User not found",
        });
      }
      return user;
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to get user",
      });
    }
  }

  @GrpcMethod("UserService", "UpdateUser")
  async updateUser(data: UpdateUserRequest) {
    try {
      return await this.userService.update(data.id, data);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to update user",
      });
    }
  }

  @GrpcMethod("UserService", "DeleteUser")
  async deleteUser(data: DeleteUserRequest) {
    try {
      await this.userService.remove(data.id);
      return { success: true, message: "User deleted successfully" };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to delete user",
      });
    }
  }

  @GrpcMethod("UserService", "SearchUsers")
  async searchUsers(data: SearchUsersRequest) {
    try {
      return await this.userService.search({
        query: data.query,
        page: data.page,
      });
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to search users",
      });
    }
  }

  @GrpcMethod("UserService", "FollowUser")
  async followUser(data: FollowRequest) {
    try {
      return await this.userService.follow(data.userId, data.targetId);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to follow user",
      });
    }
  }

  @GrpcMethod("UserService", "UnfollowUser")
  async unfollowUser(data: UnfollowRequest) {
    try {
      return await this.userService.unfollow(data.userId, data.targetId);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to unfollow user",
      });
    }
  }

  @GrpcMethod("UserService", "GetFollowers")
  async getFollowers(data: GetFollowersRequest) {
    try {
      return await this.userService.getFollowers(data.userId, data.page);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to get followers",
      });
    }
  }

  @GrpcMethod("UserService", "GetFollowing")
  async getFollowing(data: GetFollowingRequest) {
    try {
      return await this.userService.getFollowing(data.userId, data.page);
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to get following",
      });
    }
  }

  @GrpcMethod("UserService", "BlockUser")
  async blockUser(data: BlockUserRequest) {
    try {
      return await this.userService.blockUser(data.currentUserId, {
        userId: data.userIdToBlock,
      });
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to block user",
      });
    }
  }

  @GrpcMethod("UserService", "UnblockUser")
  async unblockUser(data: UnblockRequest) {
    try {
      return await this.userService.unblockUser(data.currentUserId, {
        userId: data.userIdToUnblock,
      });
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: error.message || "Failed to unblock user",
      });
    }
  }
}
