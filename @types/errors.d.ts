type ErrorsTypes =
  | 'Bad Request'
  | 'Not Found'
  | 'Duplicate Key'
  | 'Not Modified'
  | 'Cast Error'
  | 'Unauthorized';

export default ErrorsTypes;

export as namespace ErrorsTypes;
