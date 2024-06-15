import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import { GetServiceList } from "src/app/shared/services/service-stock/models/service-list.model";
import { ServicePost } from "src/app/shared/services/service-stock/models/service.post.model";
import { ServicePut } from "src/app/shared/services/service-stock/models/service.put.model";
import ServiceResponse from "src/app/shared/services/service-stock/models/service.response.model";
import { ServiceStockService } from "src/app/shared/services/service-stock/service-stock.service";
import { StockDetailsComponent } from "../stock/stock-details/stock-details.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root',
})

export class ServiceFacade{
  listService: GetServiceList[] = []
  listServiceValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number

  public readonly LIST_COLUMNS = [
    { name: 'Nome do serviço', size: 'auto' },
    { name: 'Codigo ', size: '20px' },
    { name: 'Valor', size: '20px' },

  ];
  readonly MAX_PAGE_ITEMS = 10;

  constructor(
    private router:Router,
    private service:ServiceStockService,
    public loadingService: LoadingService,
    public layout: ResponsiveLayoutService,
    public modalService: ModalService,
    public location: Location
  ){}
  public openCreateService():void{
    this.router.navigate(['/app/servico/criar-servico'])
  }
  public openEditService(id: number) {
    this.router.navigate(['/app/servico/editar-servico', id]);
  }
  public GetAll() {
    this.service.GetServiceList().subscribe
      ((data: any) => {
        this.listService = data.data
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
  public postService(post:ServicePost):Observable<ServiceResponse>{
    return this.service.PostService(post)
  }
  public PutService(update: ServicePut): Observable<ServiceResponse> {
    return this.service.UpdateService(update)
  }
  public DeleteService(del: number): Observable<ServiceResponse> {
    return this.service.DeleteService(del)
  }
  public columns() {
    this.listServiceValues = this.listService.map((data) => [
      { display: false, content: data.id.toString() },
      { display: true, content: data.name.toString() },
      { display: true, content: data.costValue.toString() },
      { display: true, content: data.innercode.toString() },
    ]);
  }
  public getById(id: number) {
    return this.service.GetById(id)
  }
  public openViewDetails(id: number){
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id).subscribe((res)=>{
      if (res.success) {
        if (res.data != null) {
          const modalRef = this.modalService.viewDetails(
            StockDetailsComponent
          );
          modalRef.componentInstance.data = res.data;
          modalRef.componentInstance.editClickEvent.subscribe(
            (val: number) => {
              this.openEditService(val);
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
  public getRouteUrl() {
    return this.router.url;
  }
  public notFoundModal() {
    this.modalService.customMessage(
      ModalComponent,
      ModalTitle.NOT_FOUND,
      'Não foi possível encontrar o Serviço especificado...'
    );
  }
}
