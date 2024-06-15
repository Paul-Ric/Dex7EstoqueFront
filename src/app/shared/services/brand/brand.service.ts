import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import BrandList from './models/brand-list.model';
import { Observable, first } from 'rxjs';
import BrandListResponse from './models/brand-list.model';
import { BrandPost } from './models/brand.post.model';
import { BrandPut } from './models/brand.put.model';
import BrandResponse from './models/brand.response.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {
  private readonly api = environment.baseApiUrl + 'brand'
  constructor(
    private http: HttpClient
  ) { }

  public GetBrandList(): Observable<BrandListResponse> {
    return this.http.get<BrandListResponse>(`${this.api}/brand-list`)
  }
  public PostBrand(post:BrandPost):Observable<BrandResponse>{
    return this.http.post<BrandResponse>(this.api,post)
  }
  public GetById(id:number):Observable<BrandResponse>{
    const params = new HttpParams().set('brandId',id.toString())
    return this.http.get<BrandResponse>(this.api,{params}).pipe(first())
  }
  public UpdateBrand(update:BrandPut):Observable<BrandResponse>{
    return this.http.put<BrandResponse>(`${this.api}/${update.id}`,update).pipe(first())
  }
  public DeleteBrand(id:number):Observable<BrandResponse>{
    const params = new HttpParams().set('id',id.toString())
    return this.http.delete<BrandResponse>(this.api,{params}).pipe(first())
  }
}
