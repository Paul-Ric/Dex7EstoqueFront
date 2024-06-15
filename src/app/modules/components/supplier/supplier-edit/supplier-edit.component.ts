import { Component } from '@angular/core';
import { ItemGroupFacade } from '../../item-group/item-group.facade';
import { ActivatedRoute } from '@angular/router';
import { SupplierFacade } from '../supplier.facade';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import { SupplierPost } from 'src/app/shared/services/supplier/models/supplier.post.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { Subscription, first } from 'rxjs';
import PutSupplier from 'src/app/shared/services/supplier/models/supplier.put.model';

@Component({
  selector: 'app-supplier-edit',
  templateUrl: './supplier-edit.component.html',
  styleUrls: ['./supplier-edit.component.scss']
})
export class SupplierEditComponent {
  isCreatePage: boolean = false;
  hasChanges = false;
  resourceForm: FormGroup;
  id:number
  private subscription: Subscription;

  constructor(
    public facade: SupplierFacade,
    private form: FormBuilder,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar-fornecedor')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }

  }
  createForm(): void {
    this.resourceForm = this.form.group({
      name: [null, Validators.required],
      contactPerson: [null, Validators.required],
      phone: [null, Validators.required],
      email: [null, Validators.required],
      address:["null",Validators.required]
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
  public postSuppplier(post: SupplierPost) {
    this.facade.PostSupplier(post).subscribe
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
  public putSupplier(put:PutSupplier){
    this.facade.PutSupplier(put).subscribe
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
  deleteSupplier(id:number){
    this.facade.DeleteSupplier(id)
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
    this.facade.openCreateSupplier()
  }
  public onSave() {
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT)
    console.log(this.isCreatePage)
    if (this.isCreatePage) {
      this.postSuppplier(this.resourceForm.value)
    }else{
      const putSupplierData: PutSupplier = {
        id: this.id,
        name:this.resourceForm.value.name,
        contactPerson:this.resourceForm.value.contactPerson,
        phone:this.resourceForm.value.phone,
        email:this.resourceForm.value.email,
        address:"",

      };
      this.putSupplier(putSupplierData)
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
      "este 'Fornecedor'",
      () => {
        this.deleteSupplier(this.id);
      },
      () => {}
    );
  }


}
