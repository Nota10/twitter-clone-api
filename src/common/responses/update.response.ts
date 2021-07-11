import ErrorsTypes from '../../../@types/errors';

export interface UpdateResponse<T> {
  status: number;
  message: string;
  data?: T | Partial<T>;
  error?: ErrorsTypes;
}
