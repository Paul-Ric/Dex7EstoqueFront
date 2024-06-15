import { Entity } from "../../base.entity";

export default class PutSupplier extends Entity{
  public name: string
  public contactPerson: string
  public phone: string
  public email: string
  public address: string
}
