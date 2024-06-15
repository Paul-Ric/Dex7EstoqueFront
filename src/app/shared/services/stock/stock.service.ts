import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import ProductList from './models/product-list.model';
import { ProductPost } from './models/product.post.model';
import ProductResponse from './models/product.response.model';
import { BaseResponse } from '../base.response';
import FileMetaData from '../file-management/models/file-metadata';
import { ProductPut } from './models/product.put.model';
import { ProductMovementPost } from './models/product-movement.post.model';
import { ProductMovementResponse } from './models/product-movement-response.model';
import ProductMovementList from './models/product-movement-list.model';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private readonly api = environment.baseApiUrl + 'product'
  readonly ProductImageChangedEvent = new EventEmitter();
  constructor(
    private http: HttpClient
  ) { }

  public GetProductList(): Observable<ProductList> {
    return this.http.get<ProductList>(`${this.api}/product-list`)
  }
  public PostProduct(post:ProductPost):Observable<ProductResponse>{
    return this.http.post<ProductResponse>(this.api,post)
  }
  public PostImage(productId: number, file: File): Observable<BaseResponse<FileMetaData>> {
    const formData = new FormData();
    formData.append('image', file);

    if (productId !== null && productId !== undefined) {
      formData.append('productId', productId.toString());
    }

    return this.http.post<BaseResponse<FileMetaData>>(this.api + '/product-picture', formData);
  }
  public GetById(id:number):Observable<ProductResponse>{
    const params = new HttpParams().set('productId',id.toString())
    return this.http.get<ProductResponse>(this.api,{params}).pipe(first())
  }
  public UpdateBrand(update:ProductPut):Observable<ProductResponse>{
    return this.http.put<ProductResponse>(`${this.api}/${update.id}`,update).pipe(first())
  }
  public DeleteBrand(id:number):Observable<ProductResponse>{
    const params = new HttpParams().set('productId',id.toString())
    return this.http.delete<ProductResponse>(this.api,{params}).pipe(first())
  }
  public DeleteImage(productId:number):Observable<BaseResponse<boolean>>{
    const params = new HttpParams().set('productId',productId.toString())
    return this.http.delete<BaseResponse<boolean>>(this.api+"/product-picture",{params}).pipe(first())
  }
  public PostMovement(post:ProductMovementPost):Observable<ProductMovementResponse>{
    return this.http.post<ProductMovementResponse>(`${this.api}/movement`,post)
  }
  public GetProductImage(productId:number):Observable<BaseResponse<string>>{
    const params = new HttpParams().set('productId',productId.toString())
    return this.http.get<BaseResponse<string>>(this.api+"/product-picture-url",{params}).pipe(first())
  }
  public GetProductMovement(productId:number):Observable<ProductMovementList>{
    return this.http.get<ProductMovementList>(this.api+'/movements/'+productId)
  }
}
