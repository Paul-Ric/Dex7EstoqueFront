export default class BaseResponse{
    public success: boolean = false;
    public data: object | undefined;
    public errors: Array<string> = [];
}
