import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetCollaboratorListed extends Entity {
  public name: string = '';
  public login: string = '';
  public role: string = '';
  public userType: string = '';
  public creationDate: Date = new Date();
}

export default class CollaboratorListResponse extends BaseResponse<Array<GetCollaboratorListed>> {}
