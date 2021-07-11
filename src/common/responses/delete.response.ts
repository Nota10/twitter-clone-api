import ErrorsTypes from '../../../@types/errors';

export interface DeleteResponse {
  status: number;
  message: string;
  error?: ErrorsTypes;
}
