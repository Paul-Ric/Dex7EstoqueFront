export default class PostServiceOrder {
  public description: string = '';
  public workDone: string = '';
  public note: string = '';
  public startDate: Date = new Date();
  public expectedCompletionDate: Date = new Date();
  public status: string = '';
  public priority: string = '';
  public osTypeId: number = 0;
  public collaboratorId: number = 0;
  public clientId: number = 0;
}
