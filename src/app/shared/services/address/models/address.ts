import { Entity } from '../../base.entity';

export default class Address extends Entity {
  public cep: string = '';
  public street: string = '';
  public number: number = 0;
  public complement: string = '';
  public neighborhood: string = '';
  public city: string = '';
  public state: string = '';
}
