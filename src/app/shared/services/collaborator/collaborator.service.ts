import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseResponse } from '../base.response';
import CollaboratorResponse from './models/collaborator.response';
import CollaboratorListResponse from './models/collaborator_list.response';
import PutCollaborator from './models/collaborator.put';
import PostCollaborator from './models/collaborator.post';
import SchedulerCollaboratorsListResponse from './models/scheduler-collaborators_list.response';
import FileMetaData from '../file-management/models/file-metadata';

@Injectable({
  providedIn: 'root',
})
export class CollaboratorService {
  constructor(private http: HttpClient) {}

  readonly ENDPOINT = environment.baseApiUrl + 'collaborator';
  readonly ProfileImageChangedEvent = new EventEmitter();

  async GetTotalCount(): Promise<BaseResponse<number>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<number>>(this.ENDPOINT + '/count')
    );

    return res;
  }

  async GetById(id: number): Promise<CollaboratorResponse> {
    const res = await firstValueFrom(
      this.http.get<CollaboratorResponse>(this.ENDPOINT, {
        params: { collaboratorId: id },
      })
    );

    return res;
  }

  async SearchList(
    text: string,
    count: number,
    skip: number
  ): Promise<CollaboratorListResponse> {
    const res = await firstValueFrom(
      this.http.get<CollaboratorListResponse>(this.ENDPOINT + '/search', {
        params: { text: text, count: count, skip: skip },
      })
    );

    return res;
  }

  async GetSchedulerCollaboratorsList(): Promise<SchedulerCollaboratorsListResponse> {
    const res = await firstValueFrom(
      this.http.get<SchedulerCollaboratorsListResponse>(
        this.ENDPOINT + '/scheduler-list'
      )
    );

    return res;
  }

  async Update(entity: PutCollaborator): Promise<CollaboratorResponse> {
    const res = await firstValueFrom(
      this.http.put<CollaboratorResponse>(
        this.ENDPOINT + `/${entity.id}`,
        entity
      )
    );

    return res;
  }

  async Add(entity: PostCollaborator): Promise<CollaboratorResponse> {
    const res = await firstValueFrom(
      this.http.post<CollaboratorResponse>(this.ENDPOINT, entity)
    );

    return res;
  }

  async Delete(id: number): Promise<CollaboratorResponse> {
    const res = await firstValueFrom(
      this.http.delete<CollaboratorResponse>(this.ENDPOINT, {
        params: { collaboratorId: id },
      })
    );

    return res;
  }

  async GetProfilePictureUrl(collaboratorId:number): Promise<BaseResponse<string>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<string>>(this.ENDPOINT + '/profile-picture-url', {
        params: { collaboratorId: collaboratorId.toString() },
      })
    );

    return res;
  }

  async PostProfilePicture(collaboratorId:number, file: File): Promise<BaseResponse<FileMetaData>>{
    const formData = new FormData();
    formData.append('image', file);
    formData.append('collaboratorId', collaboratorId.toString());

    const res = await firstValueFrom(
      this.http.post<BaseResponse<FileMetaData>>(this.ENDPOINT + '/profile-picture', formData)
    );

    return res;
  }

  async DeleteProfilePicture(collaboratorId:number): Promise<BaseResponse<boolean>> {
    const res = await firstValueFrom(
      this.http.delete<BaseResponse<boolean>>(this.ENDPOINT + '/profile-picture', {
        params: { collaboratorId: collaboratorId.toString() },
      })
    );

    return res;
  }
}
