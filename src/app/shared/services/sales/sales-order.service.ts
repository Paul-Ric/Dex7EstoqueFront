import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import SalesOrderListResponse from './models/sales-order-list.model';

@Injectable({
  providedIn: 'root'
})
export class SalesOrderService {
  private readonly api = environment.baseApiUrl + 'sales-order'
  private readonly apiClient = environment.baseApiUrl + 'client/all-clients'
  constructor(
    private http: HttpClient
  ) { }
  public GetSalesList(): Observable<SalesOrderListResponse> {
    return this.http.get<SalesOrderListResponse>(`${this.api}/sale-order-list`)
  }
  public PostSales(post:any):Observable<SalesOrderListResponse>{
    return this.http.post<SalesOrderListResponse>(this.api,post)
  }
  public GetById(id:number):Observable<SalesOrderListResponse>{
    const params = new HttpParams().set('sales',id.toString())
    return this.http.get<SalesOrderListResponse>(this.api,{params}).pipe(first())
  }
  public DeleteSales(id:number):Observable<SalesOrderListResponse>{
    const params = new HttpParams().set('id',id.toString())
    return this.http.delete<SalesOrderListResponse>(this.api,{params}).pipe(first())
  }
  public GetClient():Observable<any>{
    return this.http.get<any>(this.apiClient)
  }
}
