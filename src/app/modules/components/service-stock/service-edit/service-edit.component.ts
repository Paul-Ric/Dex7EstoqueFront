import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { ServiceFacade } from '../service-stock.facade';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ServicePost } from 'src/app/shared/services/service-stock/models/service.post.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ServicePut } from 'src/app/shared/services/service-stock/models/service.put.model';
import { ModalMessage } from 'src/app/shared/enums/modal-message';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.scss']
})
export class ServiceEditComponent {
  isCreatePage: boolean = false;
  hasChanges = false;
  resourceForm: FormGroup;
  id:number
  private subscription: Subscription;
  constructor(
    public facade: ServiceFacade,
    private form: FormBuilder,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar-servico')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }
  }
  createForm(): void {
    this.resourceForm = this.form.group({
      name: [null, Validators.required],
      innercode: [null, Validators.required],
      costValue: [null, Validators.required],
    })
  }
  ngOnInit() {
    this.getAll();
    this.createForm();

    this.subscription = this.activeRoute.params.subscribe((paramMap) => {
      const id = paramMap['id'];
      if (id != null) {
        this.id = Number.parseInt(id);
        this.facade
          .getById(this.id)
          .pipe(first()) // Use o operador 'first' para pegar apenas o primeiro valor do Observable
          .subscribe(
            (res) => {
              if (res.success && res.data != null) {
                this.resourceForm.patchValue(res.data)
                this.id=res.data.id
              } else {
                this.facade.notFoundModal();
              }
            },
            (err) => {
              this.facade.modalService.defaultError(ModalComponent);
            },
            () => {
              this.facade.loadingService.clear();
            }
          );
      }
    });
    this.resourceForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public postService(post: ServicePost) {
    this.facade.postService(post).subscribe
      ((res) => {
        if (res.success) {
          this.facade.modalService.successfullCreate();
          this.facade.location.back();
        }
      },(err:HttpErrorResponse)=>{
        if(err.status == 400)
        this.facade.modalService.listErrors(err.error.errors);
        else {
          this.facade.modalService.defaultError(ModalComponent);
        }
      },(()=>{this.facade.loadingService.clear()}))
  }
  public putSupplier(put:ServicePut){
    this.facade.PutService(put).subscribe
    ((res) => {
      if (res.success) {
        this.facade.modalService.successfulUpdate();
        this.facade.location.back();
      }
    },(err:HttpErrorResponse)=>{
      if(err.status == 400)
      this.facade.modalService.listErrors(err.error.errors);
      else {
        this.facade.modalService.defaultError(ModalComponent);
      }
    },(()=>{this.facade.loadingService.clear()}))
  }
  deleteService(id:number){
    this.facade.DeleteService(id)
    .subscribe(
      (res)=>{
        if (res.success) {
          this.facade.modalService.successfulDelete();
          this.facade.location.back();
        }
      },((error:HttpErrorResponse)=>{
        if (error.status == 400)
        this.facade.modalService.listErrors(error.error.errors);
      else {
        this.facade.modalService.defaultError(ModalComponent);
      }
      }),(()=>{
        this.facade.loadingService.clear();
      }))
  }
  public getAll() {
    this.facade.GetAll()
  }
  public onBtnAddClick() {
    this.facade.openCreateService()
  }
  public onSave() {
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT)
    console.log(this.isCreatePage)
    if (this.isCreatePage) {
      this.postService(this.resourceForm.value)
    }else{
      const putServiceData: ServicePut= {
        id: this.id,
        name:this.resourceForm.value.name,
        innercode:this.resourceForm.value.innercode,
        costValue:this.resourceForm.value.costValue,
      };
      this.putSupplier(putServiceData)
    }
  }
  public onCancel() {
    if (!this.hasChanges) {
      this.facade.location.back();
      return;
    }
    this.facade.modalService.confirmDiscard(
      () => {
        this.facade.location.back();
      },
      () => {}
    );
  }
  public onDelete() {
    this.facade.modalService.confirmDelete(
      "esta 'Marca'",
      () => {
        this.deleteService(this.id);
      },
      () => {}
    );
  }
}
