import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import ServiceList from './models/service-list.model';
import { Observable, first } from 'rxjs';
import { ServicePost } from './models/service.post.model';
import ServiceResponse from './models/service.response.model';
import { ServicePut } from './models/service.put.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceStockService {

  private readonly api = environment.baseApiUrl + 'serviceproduct'
  constructor(
    private http: HttpClient
  ) { }
  public GetServiceList(): Observable<ServiceList> {
    return this.http.get<ServiceList>(`${this.api}/service-list`)
  }
  public PostService(post:ServicePost):Observable<ServiceResponse>{
    return this.http.post<ServiceResponse>(this.api,post)
  }
  public GetById(id:number):Observable<ServiceResponse>{
    const params = new HttpParams().set('serviceProductId',id.toString())
    return this.http.get<ServiceResponse>(this.api,{params}).pipe(first())
  }
  public UpdateService(update:ServicePut):Observable<ServiceResponse>{
    return this.http.put<ServiceResponse>(`${this.api}/${update.id}`,update).pipe(first())
  }
  public DeleteService(id:number):Observable<ServiceResponse>{
    const params = new HttpParams().set('id',id.toString())
    return this.http.delete<ServiceResponse>(this.api,{params}).pipe(first())
  }
}
