import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, first } from 'rxjs';
import { BrandFacade } from '../brands.facade';
import { ActivatedRoute } from '@angular/router';
import { BrandPost } from 'src/app/shared/services/brand/models/brand.post.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { BrandPut } from 'src/app/shared/services/brand/models/brand.put.model';
import { ModalMessage } from 'src/app/shared/enums/modal-message';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent {
  isCreatePage: boolean = false;
  hasChanges = false;
  resourceForm: FormGroup;
  id:number
  private subscription: Subscription;
  constructor(
    public facade: BrandFacade,
    private form: FormBuilder,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar-marca')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }
  }
  createForm(): void {
    this.resourceForm = this.form.group({
      businessName: [null, Validators.required],
      fantasyName: [null, Validators.required],
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
  public postBrand(post: BrandPost) {
    this.facade.PostBrand(post).subscribe
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
  public putSupplier(put:BrandPut){
    this.facade.PutBrand(put).subscribe
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
    this.facade.DeleteBrand(id)
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
    this.facade.openCreateBrand()
  }
  public onSave() {
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT)
    console.log(this.isCreatePage)
    if (this.isCreatePage) {
      this.postBrand(this.resourceForm.value)
    }else{
      const putSupplierData: BrandPut= {
        id: this.id,
        businessName:this.resourceForm.value.businessName,
        fantasyName:this.resourceForm.value.fantasyName,
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
      "esta 'Marca'",
      () => {
        this.deleteSupplier(this.id);
      },
      () => {}
    );
  }
}
