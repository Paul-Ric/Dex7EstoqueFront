import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ClientService } from 'src/app/shared/services/client/client.service';
import { LoadingService } from 'src/app/shared/services/loading/loading.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { Location } from '@angular/common';
import ClientResponse from 'src/app/shared/services/client/models/client.response';
import { ModalMessage, ModalTitle } from 'src/app/shared/enums/modal-message';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { AuthenticationService } from 'src/app/shared/services/authentication/authentication.service';
import LoginRequest from 'src/app/shared/services/authentication/models/login.request';
import { HttpResponse } from '@angular/common/http';
import LoginResponse from 'src/app/shared/services/authentication/models/login.response';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationFacade {
  constructor(
    private _service: ClientService,
    public modalService: ModalService,
    public layout: ResponsiveLayoutService,
    private router: Router,
    public loadingService: LoadingService,
    public location: Location,
    private authService: AuthenticationService,
  ) {}

  enterApplication(){
    this.router.navigate(['/app']);
  }

  //#region API
  async login(request: LoginRequest): Promise<HttpResponse<LoginResponse>> {
    const result = this.authService.Login(request).then((res) => {
      if (res.body?.success) {
        this.enterApplication();
      }
      else{
        this.modalService.defaultError(ModalComponent);
      }

      return res;
    }).catch((err) => {
      if(err.status == 401){
        this.modalService.loginError();
      }
      else{
        this.modalService.defaultError(ModalComponent);
      }
      return err;
    });

    return result;
  }
  //#endregion

  //#region Modals

  //#endregion

  //#region utillity functions
  getRouteUrl() {
    return this.router.url;
  }
  //#endregion
}
