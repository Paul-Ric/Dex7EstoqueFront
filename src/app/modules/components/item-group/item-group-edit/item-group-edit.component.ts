import { Component } from '@angular/core';
import { ItemGroupFacade } from '../item-group.facade';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemGroupPost } from 'src/app/shared/services/item-group/models/item-group.post.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import { Subscription, first } from 'rxjs';
import PutItemGroup from 'src/app/shared/services/item-group/models/item-group.put.model';

@Component({
  selector: 'app-item-group-edit',
  templateUrl: './item-group-edit.component.html',
  styleUrls: ['./item-group-edit.component.scss']
})
export class ItemGroupEditComponent {

  isCreatePage: boolean = false;
  hasChanges = false;
  resourceForm: FormGroup;
  id:number
  private subscription: Subscription;
  constructor(
    public facade: ItemGroupFacade,
    public activeRoute: ActivatedRoute,
    private form: FormBuilder,
  ) {
    if (this.facade.getRouteUrl().endsWith('criar-grupo')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }
  }
  createForm():void{
    this.resourceForm = this.form.group({
      name:[null,Validators.required],
      description: [null, Validators.required],
    })
  }
  ngOnInit() {
    this.getAll()
    this.createForm()
    this.subscription = this.activeRoute.params.subscribe((paramMap) => {
      const id = paramMap['id'];
      if (id != null) {
        this.id = Number.parseInt(id);
        this.facade
          .getById(this.id)
          .pipe(first())
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

  public postSuppplier(post: ItemGroupPost) {
    this.facade.postItem(post).subscribe
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
  public putItem(put:PutItemGroup){
    this.facade.PutItem(put).subscribe
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
  public deleteItem(id:number){
    this.facade.DeleteItem(id)
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
    this.facade.getAll()
  }
  public onBtnAddClick(){
    this.facade.openCreateItem()
  }
  public onSave() {
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT)
    if (this.isCreatePage) {
      this.postSuppplier(this.resourceForm.value)
    }else{
      const putItemData: PutItemGroup = {
        id: this.id,
        name:this.resourceForm.value.name,
        description:this.resourceForm.value.description
      }
      this.putItem(putItemData)
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
      "este 'Grupo'",
      () => {
        this.deleteItem(this.id);
      },
      () => {}
    );
  }
}
