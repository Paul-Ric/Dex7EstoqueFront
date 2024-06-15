import Address from '../../address/models/address';
import { Entity } from '../../base.entity';
import Child from '../../child/models/child';
import Email from '../../email/models/email';
import PhoneNumber from '../../phone-number/models/phone-number';

export default class PutCollaborator extends Entity {
  public name: string = '';
  public role: string = '';
  public rg: string = '';
  public cpf: string = '';
  public cnpj: string = '';
  public pis: string = '';
  public isMEI: boolean = false;
  public cnh: string = '';
  public wife: string = '';
  public salary: number = 0;
  public comission: number = 0;
  public hiringDate?: Date;
  public resignationDate?: Date;
  public userType: string = '';
  public profileImageId: string | null = null;
  public profileImageFile: File | null = null;
  public addressId: number = 0;
  public address: Address = new Address();
  public children: Array<Child> = [];
  public phoneNumbers: Array<PhoneNumber> = [];
  public emails: Array<Email> = [];
}
