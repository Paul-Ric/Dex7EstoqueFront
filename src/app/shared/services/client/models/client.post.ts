import Address from "../../address/models/address";
import Email from "../../email/models/email";
import PhoneNumber from "../../phone-number/models/phone-number";

export default class PostClient {
  public name: string = '';
  public segment: string = '';
  public group: string = '';
  public speakTo: string = '';
  public role: string = '';
  public note: string = '';
  public cpf: string = '';
  public cnpj: string = '';
  public collaboratorId?: number = 0;
  public addressId: number = 0;
  public address: Address = new Address();
  public phoneNumbers: Array<PhoneNumber> = [];
  public emails: Array<Email> = [];
}
