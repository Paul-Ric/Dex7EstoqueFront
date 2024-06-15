import QuestionnaireQuestion from "../question/models/questionnaire-question";

export default class PostQuestionnaire {
  public title: string = '';
  public questions: Array<QuestionnaireQuestion> = [];
}
