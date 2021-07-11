import ErrorsTypes from '../../../@types/errors';

export interface FindResponse<T> {
  status: number;
  message: string;
  data?: T[] | Partial<T>[];
  error?: ErrorsTypes;
}
