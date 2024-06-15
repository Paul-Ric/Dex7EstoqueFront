import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import ClientResponse from './models/client.response';
import ClientListResponse from './models/client_list.response';
import PutClient from './models/client.put';
import PostClient from './models/client.post';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'client';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<ClientResponse> {
    const res = await firstValueFrom(
      this.http.get<ClientResponse>(this.ENDPOINT, {
        params: { clientId: id },
      })
    );

    return res;
  }

  async SearchList(
    text: string,
    count: number,
    skip: number
  ): Promise<ClientListResponse> {
    const res = await firstValueFrom(
      this.http.get<ClientListResponse>(this.ENDPOINT + '/search', {
        params: { text: text, count: count, skip: skip },
      })
    );

    return res;
  }

  async Update(entity: PutClient): Promise<ClientResponse> {
    const res = await firstValueFrom(
      this.http.put<ClientResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostClient): Promise<ClientResponse> {
    const res = await firstValueFrom(
      this.http.post<ClientResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<ClientResponse> {
    const res = await firstValueFrom(
      this.http.delete<ClientResponse>(this.ENDPOINT, {
        params: { clientId: id },
      })
    );

    return res;
  }
}
