export interface IResponseDto {
  success: boolean;
  data?: any;
  message?: string;
}

export interface IErrorDto {
  code?: number;
  type?: string;
  title?: string;
  detail?: string;
  instance?: string;
}
