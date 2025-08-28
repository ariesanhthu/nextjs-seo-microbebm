export interface ApiResponseDto<T> {
  data: T;
  message: string;
  success: boolean;
}