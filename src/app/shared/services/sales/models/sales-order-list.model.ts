import { Entity } from "../../base.entity";
import { BaseResponse } from "../../base.response";
import Client from "../../client/models/client";

export class GetSalesOrderList extends Entity{
   public code: number
   public issuanceDate: Date
   public species: number
   public responsible: string
   public description: string
   public client:Array<Client>
}
export default class SalesOrderListResponse extends BaseResponse<Array<GetSalesOrderList>>
{}
