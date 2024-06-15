import { Entity } from '../../base.entity';

export default class RescheduleServiceOrder extends Entity {
  public startDate: Date = new Date();
  public expectedCompletionDate: Date = new Date();
  public collaboratorId: number = 0;
}
