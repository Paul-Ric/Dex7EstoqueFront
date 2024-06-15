import { Entity } from "../../base.entity";

export default class PutChild extends Entity {
  public name: string = '';
  public birthDate: Date = new Date();
  public collaboratorId: number = 0;
}
