import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import EmailResponse from './models/email.response';
import PutEmail from './models/email.put';
import PostEmail from './models/email.post';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'email';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<EmailResponse> {
    const res = await firstValueFrom(
      this.http.get<EmailResponse>(this.ENDPOINT, {
        params: { emailId: id },
      })
    );

    return res;
  }

  async Update(entity: PutEmail): Promise<EmailResponse> {
    const res = await firstValueFrom(
      this.http.put<EmailResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostEmail): Promise<EmailResponse> {
    const res = await firstValueFrom(
      this.http.post<EmailResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<EmailResponse> {
    const res = await firstValueFrom(
      this.http.delete<EmailResponse>(this.ENDPOINT, {
        params: { emailId: id },
      })
    );

    return res;
  }
}
