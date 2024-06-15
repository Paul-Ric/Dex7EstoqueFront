import { Entity } from '../../base.entity';

export default class PhoneNumber extends Entity {
  public number: string = '';
  public isWhatsapp: boolean = false;
}
