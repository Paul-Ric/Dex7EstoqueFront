import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import { GetSalesOrderList } from "src/app/shared/services/sales/models/sales-order-list.model";
import { SalesOrderService } from "src/app/shared/services/sales/sales-order.service";
import { SalesOrderDetailsComponent } from "./sales-order-details/sales-order-details.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { DatePipe, Location } from "@angular/common";

@Injectable({
  providedIn: 'root',
})
export class SalesFacade{
  listSales: GetSalesOrderList[] | any = []
  listSalesValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number
  currentSalesList:Array<GetSalesOrderList>=[]

    public readonly LIST_COLUMNS = [
      { name: 'Codigo', size: 'auto' },
      { name: 'Data', size: 'auto' },
      { name: 'Especie', size: 'auto' },
      { name: 'Cliente', size: 'auto' },
    ];
    readonly MAX_PAGE_ITEMS = 10;
    constructor(
      private router: Router,
      public sales:SalesOrderService,
      public loadingService: LoadingService,
      public layout: ResponsiveLayoutService,
      public modalService: ModalService,
      public location: Location,
      private datePipe: DatePipe
    ) { }
    public openCreateSalesOrder(): void {
      this.router.navigate(['/app/vendas/criar-ordem-venda'])
    }
    public GetAll() {
      this.sales.GetSalesList().subscribe
        ((data: any) => {
          this.listSales = data.data
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
    private mapSpecies(speciesValue: number): string {
      switch (speciesValue) {
        case 1:
          return 'Requisição';
        case 2:
          return 'Ordem de Serviço';
        case 3:
          return 'Venda';
        case 4:
          return 'Troca';
        case 5:
          return 'Devolução';
        default:
          return 'Desconhecido';
      }
    }
    public columns() {
      this.listSalesValues = this.listSales.map((data:any) => [
        { display: false, content: data.id.toString() },
        { display: true, content: data.code.toString() },
        { display: true, content: this.datePipe.transform(data.issuanceDate, 'dd/MM/yyyy') },
        { display: true, content: this.mapSpecies(data.species) },
        { display: true, content: data.client.name }
      ]);
    }
    public PostSalesOrder(post: any){
      return this.sales.PostSales(post)
    }
    public DeleteSale(del: number): Observable<any> {
      return this.sales.DeleteSales(del)
    }
    public getById(id: number) {
      return this.sales.GetById(id)
    }
    public getClient() {
      return this.sales.GetClient()
    }

    public openViewDetails(id: number){
      this.loadingService.set(ModalMessage.LOADING_WAIT);
      this.getById(id).subscribe((res)=>{
        if (res.success) {
          if (res.data != null) {
            const modalRef = this.modalService.viewDetails(
              SalesOrderDetailsComponent
            );
            modalRef.componentInstance.data = res.data;
            modalRef.componentInstance.editClickEvent.subscribe(
              (val: number) => {
                //this.openEditBrand(val);
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
        'Não foi possível encontrar o Ordem da Venda especificado...'
      );
    }
    public listBrands(){
      this.sales.GetClient().subscribe(
        (res)=>{
          if(res.success){
            this.currentSalesList= res.data!
          }
        }
      )
    }

}
