import { Location } from "@angular/common";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { ModalMessage, ModalTitle } from "src/app/shared/enums/modal-message";
import { ItemGroupService } from "src/app/shared/services/item-group/item-group.service";
import { GetItemGroupList } from "src/app/shared/services/item-group/models/item-group-list.model";
import { ItemGroupPost } from "src/app/shared/services/item-group/models/item-group.post.model";
import PutItemGroup from "src/app/shared/services/item-group/models/item-group.put.model";
import ItemGroupResponse from "src/app/shared/services/item-group/models/item-group.response.model";
import { LoadingService } from "src/app/shared/services/loading/loading.service";
import { ModalService } from "src/app/shared/services/modal/modal.service";
import { ResponsiveLayoutService } from "src/app/shared/services/responsive-layout/layout.service";
import { ItemGroupDetailsComponent } from "./item-group-details/item-group-details.component";

@Injectable({
  providedIn: 'root',
})
export class ItemGroupFacade {

  listItemGroup: GetItemGroupList[] = []
  listItemGroupValues: Array<Array<{ display: boolean, content: any }>> = []
  loading: boolean = true;
  count: number

  public readonly LIST_COLUMNS = [
    { name: 'Nome do Grupo', size: 'auto' },
    { name: 'Descrição', size: 'auto' }
  ];
  public readonly MAX_PAGE_ITEMS = 10;

  constructor(
    private router: Router,
    private itemGroupService: ItemGroupService,
    public loadingService: LoadingService,
    public layout: ResponsiveLayoutService,
    public modalService: ModalService,
    public location: Location
  ) { }

  public openCreateItem(): void {
    this.router.navigate(['/app/grupo-itens/criar-grupo'])
  }
  public openEditItem(id: number) {
    this.router.navigate(['/app/grupo-itens/editar-grupo', id]);
  }
  public getAll() {
    this.itemGroupService.GetItemGroupList().subscribe
      ((data: any) => {
        console.log(data)
        this.listItemGroup = data.data
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
  public postItem(post: ItemGroupPost): Observable<ItemGroupResponse> {
    return this.itemGroupService.PostItemGroup(post)
  }
  public PutItem(update: PutItemGroup): Observable<ItemGroupResponse> {
    return this.itemGroupService.UpdateItemGroup(update)
  }
  public DeleteItem(del:number):Observable<ItemGroupResponse>{
    return this.itemGroupService.DeleteItemGroup(del)
  }
  public columns() {
    this.listItemGroupValues = this.listItemGroup.map((data) => [
      { display: false, content: data.id.toString() },
      { display: true, content: data.name.toString() },
      { display: true, content: data.description.toString() },
    ]);
    console.log(this.listItemGroupValues)
  }
  public getById(id:number){
    return this.itemGroupService.GetById(id)
  }

  public openViewDetails(id: number){
    this.loadingService.set(ModalMessage.LOADING_WAIT);
    this.getById(id).subscribe((res)=>{
      if (res.success) {
        if (res.data != null) {
          const modalRef = this.modalService.viewDetails(
            ItemGroupDetailsComponent
          );
          modalRef.componentInstance.data = res.data;
          modalRef.componentInstance.editClickEvent.subscribe(
            (val: number) => {
              this.openEditItem(val);
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
      'Não foi possível encontrar o Grupo especificado...'
    );
  }


}
