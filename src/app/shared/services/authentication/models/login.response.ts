import { BaseResponse } from '../../base.response';

export class LoginData {
  public id: number = 0;
  public login: string = '';
  public name: string = '';
  public userType: string = '';
  public expirationDate?: Date;
}

export default class LoginResponse extends BaseResponse<LoginData> {}
