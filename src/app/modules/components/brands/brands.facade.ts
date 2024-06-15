import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { BrandService } from "src/app/shared/services/brand/brand.service";
import { GetBrandList } from "src/app/shared/services/brand/models/brand-list.model";
import { BrandPost } from "src/app/shared/services/brand/models/brand.post.model";
import { BrandPut } from "src/app/shared/services/brand/models/brand.put.model";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import { BrandDetailsComponent } from "./brand-details/brand-details.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { Injectable } from "@angular/core";
import BrandResponse from "src/app/shared/services/brand/models/brand.response.model";

@Injectable({
  providedIn: 'root',
})
export class BrandFacade {
  listBrand: GetBrandList[] = []
  listBrandValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number

  public readonly LIST_COLUMNS = [
    { name: 'Nome Fantasia', size: 'auto' },
    { name: 'Nome Registro', size: '20px' },

  ];
  readonly MAX_PAGE_ITEMS = 10;
  constructor(
    private router: Router,
    private brandService: BrandService,
    public loadingService: LoadingService,
    public layout: ResponsiveLayoutService,
    public modalService: ModalService,
    public location: Location
  ) { }
  public openCreateBrand(): void {
    this.router.navigate(['/app/marcas/criar-marca'])
  }
  public openEditBrand(id: number) {
    this.router.navigate(['/app/marcas/editar-marca', id]);
  }
  public GetAll() {
    this.brandService.GetBrandList().subscribe
      ((data: any) => {
        this.listBrand = data.data
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
  public PostBrand(post: BrandPost): Observable<BrandResponse> {
    return this.brandService.PostBrand(post)
  }
  public PutBrand(update: BrandPut): Observable<BrandResponse> {
    return this.brandService.UpdateBrand(update)
  }
  public DeleteBrand(del: number): Observable<BrandResponse> {
    return this.brandService.DeleteBrand(del)
  }
  public columns() {
    this.listBrandValues = this.listBrand.map((data) => [
      { display: false, content: data.id.toString() },
      { display: true, content: data.fantasyName.toString() },
      { display: true, content: data.businessName.toString() },
    ]);
  }
  public getById(id: number) {
    return this.brandService.GetById(id)
  }
  public openViewDetails(id: number){
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id).subscribe((res)=>{
      if (res.success) {
        if (res.data != null) {
          const modalRef = this.modalService.viewDetails(
            BrandDetailsComponent
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
