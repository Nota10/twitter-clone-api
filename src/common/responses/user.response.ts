import { Avatar } from 'src/aws/schemas/avatar.schema';
import { User } from '../../users/schemas/user.schema';

export interface UserResponse {
  _id: string;
  name: string;
  username: string;
  protected: boolean;
  avatar: Avatar;
  email?: string;
  password?: string;
  birthday?: Date;
  bio?: string;
  followers?: User[];
  followersCount?: number;
  following?: User[];
  followingCount?: number;
  statusesCount?: number;
  favoritesCount?: number;
  isActive?: boolean;
}
