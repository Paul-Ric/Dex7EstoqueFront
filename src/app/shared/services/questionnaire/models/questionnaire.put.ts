import { Entity } from "../../base.entity";
import QuestionnaireQuestion from "../question/models/questionnaire-question";

export default class PutQuestionnaire extends Entity {
  public title: string = '';
  public questions: Array<QuestionnaireQuestion> = [];
}
