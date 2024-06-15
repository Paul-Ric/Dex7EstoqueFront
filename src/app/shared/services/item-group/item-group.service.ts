import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, first } from 'rxjs';
import { environment } from 'src/environments/environment';
import ItemGroupList from './models/item-group-list.model';
import { ItemGroupPost } from './models/item-group.post.model';
import ItemGroupResponse from './models/item-group.response.model';
import PutItemGroup from './models/item-group.put.model';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupService {
  private readonly api = environment.baseApiUrl + 'groupcategory'
  constructor(
    private http: HttpClient
  ) { }
  public GetItemGroupList(): Observable<ItemGroupList> {
    return this.http.get<ItemGroupList>(`${this.api}/group-list`)
  }
  public PostItemGroup(post:ItemGroupPost):Observable<ItemGroupResponse>{
    return this.http.post<ItemGroupResponse>(this.api,post)
  }
  public GetById(id:number):Observable<ItemGroupResponse>{
    const params = new HttpParams().set('itemId',id.toString())
    return this.http.get<ItemGroupResponse>(this.api,{params}).pipe(first())
  }
  public UpdateItemGroup(update:PutItemGroup):Observable<ItemGroupResponse>{
    return this.http.put<ItemGroupResponse>(`${this.api}/${update.id}`,update).pipe(first())
  }
  public DeleteItemGroup(id:number):Observable<ItemGroupResponse>{
    const params = new HttpParams().set('id',id.toString())
    return this.http.delete<ItemGroupResponse>(this.api,{params}).pipe(first())
  }


}
