import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import SupplierList from './models/supplier-list.model';
import { Observable, first } from 'rxjs';
import SupplierResponse from './models/supplier.response.model';
import { SupplierPost } from './models/supplier.post.model';
import { BaseResponse } from '../base.response';
import PutSupplier from './models/supplier.put.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private readonly api = environment.baseApiUrl + 'supplier'
  constructor(
    private http: HttpClient
  ) { }

  public GetSupplierList(): Observable<SupplierList> {
    return this.http.get<SupplierList>(`${this.api}/supplier-list`)
  }
  public PostSupplier(post:SupplierPost):Observable<SupplierResponse>{
    return this.http.post<SupplierResponse>(this.api,post)
  }
  public GetById(id:number):Observable<SupplierResponse>{
    const params = new HttpParams().set('supplierId',id.toString())
    return this.http.get<SupplierResponse>(this.api,{params}).pipe(first())
  }
  public UpdateSupplier(update:PutSupplier):Observable<SupplierResponse>{
    return this.http.put<SupplierResponse>(`${this.api}/${update.id}`,update).pipe(first())
  }
  public DeleteSupplier(id:number):Observable<SupplierResponse>{
    const params = new HttpParams().set('id',id.toString())
    return this.http.delete<SupplierResponse>(this.api,{params}).pipe(first())
  }

}
