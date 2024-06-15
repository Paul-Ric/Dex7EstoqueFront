import { Entity } from "../../base.entity";

export default class PutPhoneNumber extends Entity {
  public number: string = '';
  public isWhatsapp: boolean = false;
}
