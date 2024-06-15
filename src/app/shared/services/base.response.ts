export class BaseResponse<T>
{
  public success: boolean = false;
  public errors: Array<string> = [];
  public totalCount: number = 0;
  public data?: T;
}
