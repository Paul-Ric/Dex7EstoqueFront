import { Component } from '@angular/core';

import { Validators, FormBuilder } from '@angular/forms';
import LoginRequest from 'src/app/shared/services/authentication/models/login.request';
import { AuthenticationFacade } from '../authentication.facade';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private fb: FormBuilder, public facade: AuthenticationFacade) {}

  hidePassword = true;

  form = this.fb.group({
    login: ['', [Validators.required, Validators.maxLength(100)]],
    password: ['', [Validators.required, Validators.maxLength(50)]],
  });

  readonly login = this.form.get('login')!;
  readonly password = this.form.get('password')!;

  async onLoginFormSubmit() {
    const loginRequest = new LoginRequest();
    loginRequest.login = this.login.value!;
    loginRequest.password = this.password.value!;

    await this.facade.login(loginRequest);
  }
}
