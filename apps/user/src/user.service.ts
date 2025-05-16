import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument } from "./schemas/user.schema";
import { QueryUserDto } from "./dto/query-user.dto";
import { BlockUserDto } from "./dto/block-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      throw new Error("User with this email or username already exists");
    }

    // Remove hashing here because password is already hashed in AuthService.register
    const newUser = new this.userModel({
      ...createUserDto,
      followers: [],
      following: [],
    });

    return newUser.save();
  }

  async search(
    queryUserDto: QueryUserDto
  ): Promise<{ users: User[]; totalCount: number }> {
    const { query = "", page = 1 } = queryUserDto;
    const limit = 10;
    const skip = (page - 1) * limit;

    const searchRegex = new RegExp(query, "i");

    const users = await this.userModel
      .find({
        $or: [
          { username: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex },
        ],
      })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .exec();

    const totalCount = await this.userModel.countDocuments({
      $or: [
        { username: searchRegex },
        { fullName: searchRegex },
        { email: searchRegex },
      ],
    });

    return { users, totalCount };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select("-password");
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).select("-password");
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select("-password");

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  async follow(userId: string, targetId: string): Promise<User> {
    if (userId === targetId) {
      throw new BadRequestException("Users cannot follow themselves");
    }

    const session = await this.userModel.startSession();
    session.startTransaction();

    try {
      const [user, targetUser] = await Promise.all([
        this.userModel.findById(userId).session(session),
        this.userModel.findById(targetId).session(session),
      ]);

      if (!user || !targetUser) {
        throw new NotFoundException(`One or both users not found`);
      }

      if (user.following.includes(targetId)) {
        throw new ConflictException("Already following this user");
      }

      await this.userModel
        .findByIdAndUpdate(
          userId,
          {
            $addToSet: { following: targetId },
            $push: { followers: userId },
          },
          { new: true, session }
        )
        .select("-password");

      await this.userModel.findByIdAndUpdate(
        targetId,
        {
          $addToSet: { followers: userId },
          $inc: { followersCount: 1 },
        },
        { session }
      );

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async unfollow(userId: string, targetId: string): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(
        userId,
        { $pull: { following: targetId } },
        { new: true }
      )
      .select("-password");

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userModel.findByIdAndUpdate(targetId, {
      $pull: { followers: userId },
    });

    return user;
  }

  async getFollowers(
    userId: string,
    page = 1
  ): Promise<{ users: User[]; totalCount: number }> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const followers = await this.userModel
      .find({ _id: { $in: user.followers } })
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalCount = user.followers.length;

    return { users: followers, totalCount };
  }

  async getFollowing(
    userId: string,
    page = 1
  ): Promise<{ users: User[]; totalCount: number }> {
    const limit = 10;
    const skip = (page - 1) * limit;

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const following = await this.userModel
      .find({ _id: { $in: user.following } })
      .select("-password")
      .skip(skip)
      .limit(limit);

    const totalCount = user.following.length;

    return { users: following, totalCount };
  }

  async blockUser(
    currentUserId: string,
    blockUserDto: BlockUserDto
  ): Promise<User | null> {
    const { userId } = blockUserDto;

    const userToBlock = await this.userModel.findById(userId);
    if (!userToBlock) {
      throw new NotFoundException("User to block not found");
    }

    const currentUser = await this.userModel.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException("Current user not found");
    }

    if (currentUser.blockedUsers.includes(userId)) {
      return currentUser;
    }

    return this.userModel
      .findByIdAndUpdate(
        currentUserId,
        { $addToSet: { blockedUsers: userId } },
        { new: true }
      )
      .exec();
  }

  async unblockUser(
    currentUserId: string,
    blockUserDto: BlockUserDto
  ): Promise<User | null> {
    const { userId } = blockUserDto;

    const userToUnblock = await this.userModel.findById(userId);
    if (!userToUnblock) {
      throw new NotFoundException("User to unblock not found");
    }

    const currentUser = await this.userModel.findById(currentUserId);
    if (!currentUser) {
      throw new NotFoundException("Current user not found");
    }

    return this.userModel
      .findByIdAndUpdate(
        currentUserId,
        { $pull: { blockedUsers: userId } },
        { new: true }
      )
      .exec();
  }
}
