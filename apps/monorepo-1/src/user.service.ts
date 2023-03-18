import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  UserProfile,
  UserProfileDocument,
} from './schemas/user-profile.schema';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserProfile.name)
    private userProfileModel: Model<UserProfileDocument>,
  ) {}

  async create(email: string, hash: string): Promise<any> {
    const newUser = await this.userModel.create({ email, secret: hash });
    return newUser;
  }

  async checkUserExistsByEmail(email: string) {
    const exist = await this.userModel.findOne({ email });
    if (!exist) {
      return false;
    }
    return true;
  }
  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  async getAllUsers(pno: number) {
    const PAGINATION_LIMIT = 25;
    const users = await this.userModel
      .find({})
      .limit(PAGINATION_LIMIT)
      .skip(pno * PAGINATION_LIMIT)
      .exec();
    return users;
  }
  async getUserProfile(id: Types.ObjectId) {
    const userProfile = await this.userProfileModel
      .findOne({ userId: id })
      .populate('userId', '-secret')
      .exec();
    if (userProfile == null) {
      // If the userProfile is null, return an error message instead
      return { message: 'User data not found' };
    }

    return userProfile;
  }
  async UpdateUserProfile(userId: Types.ObjectId, userProfileData) {
    // Check if user profile exists for the given user ID
    let userProfile = await this.userProfileModel.findOne({ userId }).exec();

    // If user profile does not exist, create a new one
    if (!userProfile) {
      userProfile = new this.userProfileModel(userProfileData);
      userProfile.userId = userId;
    } else {
      // Otherwise, update the existing user profile with the new userProfileData
      userProfile.firstName =
        userProfileData.firstName || userProfile.firstName;
      userProfile.lastName = userProfileData.lastName || userProfile.lastName;
      userProfile.dob = userProfileData.dob || userProfile.dob;
      userProfile.address = userProfileData.address || userProfile.address;
      userProfile.phone = userProfileData.phone || userProfile.phone;
    }

    // Save the updated user profile to the database
    return userProfile.save();
  }
  async deleteUser(id: Types.ObjectId) {
    await this.userModel.findByIdAndDelete({ _id: id }).exec();
    await this.userProfileModel.findOneAndDelete({ userId: id }).exec();
  }
}
