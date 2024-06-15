import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';

export class GetSchedulerCollaboratorListed extends Entity {
  public name: string = '';
}

export default class SchedulerCollaboratorsListResponse extends BaseResponse<Array<GetSchedulerCollaboratorListed>> {}
