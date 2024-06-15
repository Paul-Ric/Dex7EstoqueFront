import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import ChildResponse from './models/child.response';
import PutChild from './models/child.put';
import PostChild from './models/child.post';

@Injectable({
  providedIn: 'root',
})
export class ChildService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'child';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<ChildResponse> {
    const res = await firstValueFrom(
      this.http.get<ChildResponse>(this.ENDPOINT, {
        params: { childId: id },
      })
    );

    return res;
  }

  async Update(entity: PutChild): Promise<ChildResponse> {
    const res = await firstValueFrom(
      this.http.put<ChildResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostChild): Promise<ChildResponse> {
    const res = await firstValueFrom(
      this.http.post<ChildResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<ChildResponse> {
    const res = await firstValueFrom(
      this.http.delete<ChildResponse>(this.ENDPOINT, {
        params: { childId: id },
      })
    );

    return res;
  }
}
