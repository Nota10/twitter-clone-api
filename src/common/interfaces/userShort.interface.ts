import { Avatar } from './avatar.interface';

export type UserShort = {
  id: string;
  name: string;
  username: string;
  protected: boolean;
  avatar?: Avatar;
};
