import Address from '../../address/models/address';
import { Entity } from '../../base.entity';
import Child from '../../child/models/child';
import Email from '../../email/models/email';
import FileMetaData from '../../file-management/models/file-metadata';
import PhoneNumber from '../../phone-number/models/phone-number';

export default class Collaborator extends Entity {
  public name: string = '';
  public login: string = '';
  public password: string = '';
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
  public creationDate: Date = new Date();
  public userType: string = '';
  public profileImageFile: File | null = null;
  public profileImageId: string | null = null;
  public profileImage: FileMetaData | null = null;
  public addressId: number = 0;
  public address: Address = new Address();
  public children: Array<Child> = [];
  public phoneNumbers: Array<PhoneNumber> = [];
  public emails: Array<Email> = [];
}
