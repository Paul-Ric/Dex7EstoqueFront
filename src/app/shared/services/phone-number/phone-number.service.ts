import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import PhoneNumberResponse from './models/phone-number.response';
import PutPhoneNumber from './models/phone-number.put';
import PostPhoneNumber from './models/phone-number.post';

@Injectable({
  providedIn: 'root',
})
export class PhoneNumberService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'phone-number';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<PhoneNumberResponse> {
    const res = await firstValueFrom(
      this.http.get<PhoneNumberResponse>(this.ENDPOINT, {
        params: { phoneNumberId: id },
      })
    );

    return res;
  }

  async Update(entity: PutPhoneNumber): Promise<PhoneNumberResponse> {
    const res = await firstValueFrom(
      this.http.put<PhoneNumberResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostPhoneNumber): Promise<PhoneNumberResponse> {
    const res = await firstValueFrom(
      this.http.post<PhoneNumberResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<PhoneNumberResponse> {
    const res = await firstValueFrom(
      this.http.delete<PhoneNumberResponse>(this.ENDPOINT, {
        params: { phoneNumberId: id },
      })
    );

    return res;
  }
}
