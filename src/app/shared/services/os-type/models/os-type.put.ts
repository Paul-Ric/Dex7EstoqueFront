import { Entity } from "../../base.entity";

export default class PutOsType extends Entity {
  public name: string = '';
  public colorHexCode: string = '#000000';
  public description: string = '';
  public toleranceTimeTicks: number = 0;
  public estimatedTimeTicks: number = 0;
  public questionnaireId: number = 0;
}
