import { Entity } from '../../base.entity';
import Collaborator from '../../collaborator/models/collaborator';

export default class Child extends Entity {
  public name: string = '';
  public birthDate: Date = new Date();
  public collaboratorId: number = 0;
  public Collaborator: Collaborator = new Collaborator();
}
