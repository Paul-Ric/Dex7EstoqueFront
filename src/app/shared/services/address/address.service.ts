import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import AddressResponse from './models/address.response';
import PutAddress from './models/address.put';
import PostAddress from './models/address.post';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'address';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<AddressResponse> {
    const res = await firstValueFrom(
      this.http.get<AddressResponse>(this.ENDPOINT, {
        params: { addressId: id },
      })
    );

    return res;
  }

  async Update(entity: PutAddress): Promise<AddressResponse> {
    const res = await firstValueFrom(
      this.http.put<AddressResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostAddress): Promise<AddressResponse> {
    const res = await firstValueFrom(
      this.http.post<AddressResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<AddressResponse> {
    const res = await firstValueFrom(
      this.http.delete<AddressResponse>(this.ENDPOINT, {
        params: { addressId: id },
      })
    );

    return res;
  }
}
