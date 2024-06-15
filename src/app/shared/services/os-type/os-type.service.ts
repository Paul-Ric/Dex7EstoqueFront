import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import OsTypeResponse from './models/os-type.response';
import OsTypeListResponse from './models/os-type_list.response';
import { BaseResponse } from '../base.response';
import PutOsType from './models/os-type.put';
import PostOsType from './models/os-type.post';

@Injectable({
  providedIn: 'root',
})
export class OsTypeService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'ostype';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<OsTypeResponse> {
    const res = await firstValueFrom(
      this.http.get<OsTypeResponse>(this.ENDPOINT, {
        params: { osTypeId: id },
      })
    );

    return res;
  }

  async SearchList(
    text: string,
    count: number,
    skip: number
  ): Promise<OsTypeListResponse> {
    const res = await firstValueFrom(
      this.http.get<OsTypeListResponse>(this.ENDPOINT + '/search', {
        params: { text: text, count: count, skip: skip },
      })
    );

    return res;
  }

  async Update(entity: PutOsType): Promise<OsTypeResponse> {
    const res = await firstValueFrom(
      this.http.put<OsTypeResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostOsType): Promise<OsTypeResponse> {
    const res = await firstValueFrom(
      this.http.post<OsTypeResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<OsTypeResponse> {
    const res = await firstValueFrom(
      this.http.delete<OsTypeResponse>(this.ENDPOINT, {
        params: { osTypeId: id },
      })
    );

    return res;
  }
}
