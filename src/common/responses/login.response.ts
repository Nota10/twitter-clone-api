import ErrorsTypes from '../../../@types/errors';

export interface LoginResponse {
  status: number;
  message: string;
  accessToken?: string;
  userId?: string;
  error?: ErrorsTypes;
}
