import ErrorsTypes from '../../../@types/errors';

export interface CreateResponse<T> {
  status: number;
  message: string;
  data?: T | Partial<T>;
  error?: ErrorsTypes;
}
