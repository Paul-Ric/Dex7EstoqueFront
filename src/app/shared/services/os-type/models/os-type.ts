import { Entity } from "../../base.entity";
import Questionnaire from "../../questionnaire/models/questionnaire";

export default class OsType extends Entity {
  public name: string = '';
  public colorHexCode: string = '#000000';
  public description: string = '';
  public toleranceTime: number = 0;
  public estimatedTime: number = 0;
  public questionnaireId: number = 0;
  public questionnaire: Questionnaire = new Questionnaire();
}
