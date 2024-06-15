import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import { GetSupplierList } from "src/app/shared/services/supplier/models/supplier-list.model";
import { SupplierPost } from "src/app/shared/services/supplier/models/supplier.post.model";
import SupplierResponse from "src/app/shared/services/supplier/models/supplier.response.model";
import { SupplierService } from "src/app/shared/services/supplier/supplier.service";
import { SupplierDetailsComponent } from "./supplier-details/supplier-details.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import PutSupplier from "src/app/shared/services/supplier/models/supplier.put.model";

@Injectable({
  providedIn: 'root',
})
export class SupplierFacade{
  listSupplier: GetSupplierList[] = []
  listSupplierValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number

  public readonly LIST_COLUMNS = [
    { name: 'Nome', size: 'auto' },
    { name: 'Pessoa responsável', size: '20px' },

  ];
  readonly MAX_PAGE_ITEMS = 10;

  constructor(
    private router:Router,
    private supplierService:SupplierService,
    public loadingService: LoadingService,
    public layout: ResponsiveLayoutService,
    public modalService: ModalService,
    public location: Location
  ){}

  public openCreateSupplier():void{
    this.router.navigate(['/app/fornecedores/criar-fornecedor'])
  }
  public openEditCollaborator(id: number) {
    this.router.navigate(['/app/fornecedores/editar-fornecedor', id]);
  }
  public GetAll() {
    this.supplierService.GetSupplierList().subscribe
      ((data: any) => {
        this.listSupplier = data.data
        this.count = data.totalCount
        this.columns()
      },
        (error: any) => {
          console.error(error);
        },
        () => {
          this.loading = false
        }
      )
  }
  public PostSupplier(post:SupplierPost):Observable<SupplierResponse>{
      return this.supplierService.PostSupplier(post)
  }
  public PutSupplier(update:PutSupplier):Observable<SupplierResponse>{
    return this.supplierService.UpdateSupplier(update)
  }
  public DeleteSupplier(del:number):Observable<SupplierResponse>{
    return this.supplierService.DeleteSupplier(del)
  }
  public columns() {
    this.listSupplierValues = this.listSupplier.map((data) => [
      { display: false, content: data.id.toString()},
      { display: true, content: data.name.toString()},
      { display: true, content: data.contactPerson.toString()},
    ]);
  }
  public getById(id:number){
    return this.supplierService.GetById(id)
  }
  public openViewDetails(id: number){
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id).subscribe((res)=>{
      if (res.success) {
        if (res.data != null) {
          const modalRef = this.modalService.viewDetails(
            SupplierDetailsComponent
          );
          modalRef.componentInstance.data = res.data;
          modalRef.componentInstance.editClickEvent.subscribe(
            (val: number) => {
              this.openEditCollaborator(val);
              modalRef.close();
            }
          );
        } else {
          this.notFoundModal();
          //this.loadListView();
        }
      }
      else {
        this.modalService.defaultError(ModalComponent);
      }

    },((error)=>{this.modalService.defaultError(ModalComponent);}
    ),(()=>{this.loadingService.clear()}))

  }
  getRouteUrl() {
    return this.router.url;
  }
  public notFoundModal() {
    this.modalService.customMessage(
      ModalComponent,
      ModalTitle.NOT_FOUND,
      'Não foi possível encontrar o Fornecedor especificado...'
    );
  }

}

