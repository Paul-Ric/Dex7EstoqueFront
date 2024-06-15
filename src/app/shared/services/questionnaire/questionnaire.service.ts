import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import QuestionnaireResponse from './models/questionnaire.response';
import QuestionnaireListResponse from './models/questionnaire_list.response';
import PutQuestionnaire from './models/questionnaire.put';
import PostQuestionnaire from './models/questionnaire.post';

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'questionnaire';

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<QuestionnaireResponse> {
    const res = await firstValueFrom(
      this.http.get<QuestionnaireResponse>(this.ENDPOINT, {
        params: { questionnaireId: id },
      })
    );

    return res;
  }

  async SearchList(
    text: string,
    count: number,
    skip: number
  ): Promise<QuestionnaireListResponse> {
    const res = await firstValueFrom(
      this.http.get<QuestionnaireListResponse>(this.ENDPOINT + '/search', {
        params: { text: text, count: count, skip: skip },
      })
    );

    return res;
  }

  async Update(entity: PutQuestionnaire): Promise<QuestionnaireResponse> {
    const res = await firstValueFrom(
      this.http.put<QuestionnaireResponse>(this.ENDPOINT + `/${entity.id}`, entity)
    );

    return res;
  }

  async Add(entity: PostQuestionnaire): Promise<QuestionnaireResponse> {
    const res = await firstValueFrom(
      this.http.post<QuestionnaireResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<QuestionnaireResponse> {
    const res = await firstValueFrom(
      this.http.delete<QuestionnaireResponse>(this.ENDPOINT, {
        params: { questionnaireId: id },
      })
    );

    return res;
  }
}
