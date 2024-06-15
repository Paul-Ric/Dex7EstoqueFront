import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { BaseResponse } from "src/app/shared/services/base.response";
import { BrandService } from "src/app/shared/services/brand/brand.service";
import BrandListResponse, { GetBrandList } from "src/app/shared/services/brand/models/brand-list.model";
import FileMetaData from "src/app/shared/services/file-management/models/file-metadata";
import { ItemGroupService } from "src/app/shared/services/item-group/item-group.service";
import { GetItemGroupList } from "src/app/shared/services/item-group/models/item-group-list.model";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import ProductList, { GetProductList } from "src/app/shared/services/stock/models/product-list.model";
import { ProductPost } from "src/app/shared/services/stock/models/product.post.model";
import { ProductPut } from "src/app/shared/services/stock/models/product.put.model";
import ProductResponse from "src/app/shared/services/stock/models/product.response.model";
import { StockService } from "src/app/shared/services/stock/stock.service";
import { GetSupplierList } from "src/app/shared/services/supplier/models/supplier-list.model";
import { SupplierService } from "src/app/shared/services/supplier/supplier.service";
import { StockDetailsComponent } from "./stock-details/stock-details.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { ProductMovementResponse } from "src/app/shared/services/stock/models/product-movement-response.model";
import ProductMovementList from "src/app/shared/services/stock/models/product-movement-list.model";

@Injectable({
  providedIn: 'root',
})

export class StockFacade {

  listProduct: GetProductList[] = []
  listProductValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number
  currentBrandList:Array<GetBrandList>=[]
  currentSupplierList:Array<GetSupplierList>=[]
  currentItemGroupList:Array<GetItemGroupList>=[]

  public readonly LIST_COLUMNS = [
    { name: 'Codigo', size: '20px' },
    { name: 'Nome', size: 'auto' },
    { name: 'SKU', size: '10%' },
  ];
  readonly MAX_PAGE_ITEMS = 10;
  constructor(
    private stockService: StockService,
    private router: Router,
    public loadingService: LoadingService,
    public layout: ResponsiveLayoutService,
    public modalService: ModalService,
    public brand:BrandService,
    public supplier:SupplierService,
    public itemGroup:ItemGroupService,
    public location: Location,
  ) { }
  public openCreateProduct():void{
    this.router.navigate(['/app/estoque/criar-produtos'])
  }
  public openEditBrand(id: number) {
    this.router.navigate(['/app/estoque/editar-produto', id]);
  }
  public GetAll() {
    this.stockService.GetProductList().subscribe
      ((data: any) => {
        this.listProduct = data.data
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
  public postProduct(post:ProductPost):Observable<ProductResponse>{
    return this.stockService.PostProduct(post)
  }
  public PutProduct(update: ProductPut): Observable<ProductResponse> {
    return this.stockService.UpdateBrand(update)
  }
  public DeleteProduct(del: number): Observable<ProductResponse> {
    return this.stockService.DeleteBrand(del)
  }
  public DeleteImageProduct(del:number):Observable<BaseResponse<boolean>>{
    return this.stockService.DeleteImage(del)
  }
  public PostMovement(post:any):Observable<any>{
    return this.stockService.PostMovement(post)
  }
  public GetMovement(productId:number):Observable<ProductMovementList>{
    return this.stockService.GetProductMovement(productId)
  }
  public columns() {
    this.listProductValues = this.listProduct.map((data) => [
      { display: false, content: data.id.toString() },
      { display: true, content: data.code.toString() },
      { display: true, content: data.name.toString() },
      { display: true, content: data.sku.toString() },
    ]);
  }
  public getById(id: number) {
    return this.stockService.GetById(id)
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
              this.openEditBrand(val);
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
  public listBrands(){
    this.brand.GetBrandList().subscribe(
      (res)=>{
        if(res.success){
          this.currentBrandList= res.data!
        }
      }
    )
  }
  public listSupplier():void{
    this.supplier.GetSupplierList().subscribe(
      (res)=>{
        if(res.success){
          this.currentSupplierList= res.data!
        }
      }
    )
  }
  public listItemGroup():void{
    this.itemGroup.GetItemGroupList().subscribe(
      (res)=>{
        if(res.success){
          this.currentItemGroupList= res.data!
        }
      }
    )
  }
  public GetProductImage(productId:number):Observable<BaseResponse<string>>{
    return this.stockService.GetProductImage(productId)
  }
  public getRouteUrl() {
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
