import ErrorsTypes from '../../../@types/errors';

export interface FindIdResponse<T> {
  status: number;
  message: string;
  data?: T | Partial<T>;
  error?: ErrorsTypes;
}
