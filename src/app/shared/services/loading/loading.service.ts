import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  active: boolean = false;
  message: string = '';

  set(msg:string){
    this.active = true;
    this.message = msg;
  }

  clear(){
    this.active = false;
    this.message = '';
  }
}
