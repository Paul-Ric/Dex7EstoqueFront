import { Entity } from '../../base.entity';
import { BaseResponse } from '../../base.response';
import Questionnaire from '../../questionnaire/models/questionnaire';

export class GetOsType extends Entity {
  public name: string = '';
  public colorHexCode: string = '';
  public description: string = '';
  public toleranceTime: number = 0;
  public estimatedTime: number = 0;
  public questionnaireId: number = 0;
  public questionnaire: Questionnaire = new Questionnaire();
}

export default class OsTypeResponse extends BaseResponse<GetOsType>{}
