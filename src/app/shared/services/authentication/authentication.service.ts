import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import LoginRequest from './models/login.request';
import LoginResponse, { LoginData } from './models/login.response';
import { BaseResponse } from '../base.response';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private router: Router) {}

  readonly ENDPOINT = environment.baseApiUrl + 'auth';

  async Login(request: LoginRequest): Promise<HttpResponse<LoginResponse>> {
    const result = await firstValueFrom(
      this.http.post<LoginResponse>(this.ENDPOINT + '/login', request, {
        withCredentials: true,
        observe: 'response',
      })
    ).then((res) => {
      if (res.body?.success) this.SetLoggedUser(res.body?.data!);

      return res;
    });

    return result;
  }

  async Logout(): Promise<BaseResponse<string>> {
    const result = await firstValueFrom(
      this.http.post<BaseResponse<string>>(this.ENDPOINT + '/logout', null, {
        withCredentials: true,
      })
    ).then((res) => {
      if (res.success) {
        this.RemoveLoggedUser();
        this.router.navigate(['/login']);
      }

      return res;
    });

    return result;
  }

  async isLoggedIn(): Promise<BaseResponse<boolean>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<boolean>>(this.ENDPOINT, {
        withCredentials: true,
      })
    ).then((res) => {
      return res;
    });

    return res;
  }

  async TestAuthorize(): Promise<BaseResponse<null>> {
    const res = await firstValueFrom(
      this.http.get<BaseResponse<null>>(this.ENDPOINT + '/TestAuthorize', {
        withCredentials: true,
      })
    );

    return res;
  }

  SetLoggedUser(user: LoginData) {
    localStorage.setItem('logged_user', JSON.stringify(user));
  }

  RemoveLoggedUser() {
    localStorage.removeItem('logged_user');
  }

  GetLoggedUser(): LoginData | null {
    const userString = localStorage.getItem('logged_user');

    if (userString == null) return null;

    const user = JSON.parse(userString) as LoginData;

    return user;
  }
}
