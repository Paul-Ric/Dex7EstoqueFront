import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import ServiceOrderResponse from './models/service-order.response';
import ServiceOrderListResponse from './models/service-order_list.response';
import PutServiceOrder from './models/service-order.put';
import PostServiceOrder from './models/service-order.post';
import RescheduleServiceOrder from './models/service-order.reschedule';

@Injectable({
  providedIn: 'root',
})
export class ServiceOrderService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'serviceorder';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<ServiceOrderResponse> {
    const res = await firstValueFrom(
      this.http.get<ServiceOrderResponse>(this.ENDPOINT, {
        params: { osId: id },
      })
    );

    return res;
  }

  async SearchList(
    text: string,
    count: number,
    skip: number
  ): Promise<ServiceOrderListResponse> {
    const res = await firstValueFrom(
      this.http.get<ServiceOrderListResponse>(this.ENDPOINT + '/search', {
        params: { text: text, count: count, skip: skip },
      })
    );

    return res;
  }

  async Reschedule(data: RescheduleServiceOrder): Promise<ServiceOrderResponse> {
    const res = await firstValueFrom(
      this.http.put<ServiceOrderResponse>(
        this.ENDPOINT + `/reschedule`,
        data
      )
    );

    return res;
  }

  async GetByDateRange(start: Date, end: Date): Promise<ServiceOrderListResponse> {
    const res = await firstValueFrom(
      this.http.get<ServiceOrderListResponse>(this.ENDPOINT + '/range', {
        params: { start: start.toDateString(), end: end.toDateString()},
      })
    );

    return res;
  }

  async Update(entity: PutServiceOrder): Promise<ServiceOrderResponse> {
    const res = await firstValueFrom(
      this.http.put<ServiceOrderResponse>(
        this.ENDPOINT + `/${entity.id}`,
        entity
      )
    );

    return res;
  }

  async Add(entity: PostServiceOrder): Promise<ServiceOrderResponse> {
    const res = await firstValueFrom(
      this.http.post<ServiceOrderResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<ServiceOrderResponse> {
    const res = await firstValueFrom(
      this.http.delete<ServiceOrderResponse>(this.ENDPOINT, {
        params: { osId: id },
      })
    );

    return res;
  }
}
