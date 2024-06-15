import { Entity } from '../../base.entity';
import Client from '../../client/models/client';
import Collaborator from '../../collaborator/models/collaborator';
import OsType from '../../os-type/models/os-type';

export default class ServiceOrder extends Entity {
  public description: string = '';
  public workDone: string = '';
  public note: string = '';
  public startDate?: Date;
  public expectedCompletionDate?: Date;
  public status: string = '';
  public priority: string = '';
  public osTypeId: number = 0;
  public type: OsType = new OsType();
  public collaboratorId: number = 0;
  public responsible: Collaborator = new Collaborator();
  public clientId: number = 0;
  public client: Client = new Client();
}
