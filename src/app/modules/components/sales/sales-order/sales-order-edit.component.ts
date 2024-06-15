import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, map, startWith } from 'rxjs';
import { Species } from 'src/app/shared/services/sales/models/species.model';
import { SalesFacade } from '../sales.facade';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import { GetClientListed } from 'src/app/shared/services/client/models/client_list.response';


@Component({
  selector: 'app-sales-order-edit',
  templateUrl: './sales-order-edit.component.html',
  styleUrls: ['./sales-order-edit.component.scss']
})
export class SalesOrderComponent {
  resourceForm: FormGroup;
  filteredClients: Observable<GetClientListed[]>;
  isCreatePage: boolean = false;
  hasChanges = false;
  id:number
  currentDisplayedOptions = 3;
  maxDisplayedOptions = 3;
  item:number
  private subscription: Subscription;
  readonly SPECIES:Species[] = [
    {id:1,species:'Requisição'},
    {id:2,species:'Ordem de Serviço'},
    {id:3,species:'Venda'},
    {id:4,species:'Troca'},
    {id:5,species:'Devolução'}
  ]
  constructor(
    private fb: FormBuilder,
    public facade: SalesFacade,
    public activeRoute: ActivatedRoute
    ) {
      if (this.facade.getRouteUrl().endsWith('criar-ordem-venda')) {
        this.isCreatePage = true;
        this.facade.loadingService.clear();
        return;
      }
     }

  ngOnInit() {
    this.createForm()
    this.facade.getClient()
    this.facade.listBrands()

    this.filteredClients = this.resourceForm.get('client')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItemGroup(value))
    );
  }
  createForm(){
    this.resourceForm=this.fb.group({
      code:[null,Validators.required],
      issuanceDate:[null,Validators.required],
      species:[null,Validators.required],
      client:[null,Validators.required],
      responsible:[null,Validators.required],
      items: this.fb.array([this.createItem()]),
      services:this.fb.array([this.createItem()]),
      description:[null,Validators.required]
    })
  }
  createItem(): FormGroup {
    return this.fb.group({
      item: '',
      quantidade: '',
      valor: '',
      desconto: '',
      subtotal:''
    });
  }

  get formItems(): FormArray {
    return this.resourceForm.get('items') as FormArray;
  }

  get formServices(): FormArray {
    return this.resourceForm.get('services') as FormArray;
  }

  addItem(type: 'items' | 'services'): void {
    const formArray = this.resourceForm.get(type) as FormArray;
    formArray.push(this.createItem());
  }

  removeItem(type: 'items' | 'services', index: number): void {
    const formArray = this.resourceForm.get(type) as FormArray;
    formArray.removeAt(index);
  }

  calculateTotal(type: 'items' | 'services'): number {
    const formArray = this.resourceForm.get(type) as FormArray;
    let total = 0;

    formArray.controls.forEach((control) => {
      const subtotal = control.get('subtotal')?.value;
      total += subtotal ? parseFloat(subtotal) : 0;
    });

    return total;
  }
  calculateSubtotal(itemForm: AbstractControl<any, any>): number {
    const quantidade = itemForm.get('quantidade')?.value || 0;
    const valor = itemForm.get('valor')?.value || 0;
    const desconto = itemForm.get('desconto')?.value || 0;

    const subtotal = quantidade * valor;
    const descontoValue = subtotal * (desconto / 100); // Calculating discount amount

    return subtotal - descontoValue; // Subtracting discount amount from subtotal
  }



  calculateTotalItems(): any {
    let total = 0;
    const itemsArray = this.resourceForm.get('items') as FormArray;
    itemsArray.controls.forEach((control) => {
      total += this.calculateSubtotal(control as FormGroup);
    });

    return total;
  }

  calculateTotalServices(): number {
    let total = 0;

    const servicesArray = this.resourceForm.get('services') as FormArray;
    servicesArray.controls.forEach((control) => {
      total += this.calculateSubtotal(control as FormGroup);
    });

    return total;
  }
  onSave(){
    this.facade.loadingService.set(ModalMessage.VALIDATING_WAIT)
    console.log(this.isCreatePage)
    if (this.isCreatePage) {
      this.postSales(this.resourceForm.value)
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
        this.deleteSales(this.id);
      },
      () => {}
    );
  }
  public postSales(post: any) {
    this.facade.PostSalesOrder(post).subscribe
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
  deleteSales(id:number){
    this.facade.DeleteSale(id)
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
  public displayItemGroup(item: GetClientListed): string {
    return item ? item.name : '';
  }
  private filterItemGroup(value: string | any): any[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : '');

    if (typeof value === 'string') {
      return this.facade.currentSalesList.filter((supplier:any) =>
        supplier.client.toLowerCase().includes(filterValue)
      ).slice(0, this.currentDisplayedOptions);
    }

    return this.facade.currentSalesList.filter((supplier:any) =>
      supplier.client.toLowerCase().includes(filterValue)
    ).slice(0, this.currentDisplayedOptions);
  }
  public onItemSelection(event: any) {
    const selectedItem = event.option.value as GetClientListed;
    const selectedItemId = selectedItem.id;
    this.item=selectedItemId
    console.log('Item ID:', selectedItemId);
  }

  public loadMoreOptionsItemGroup() {
    this.currentDisplayedOptions += this.maxDisplayedOptions;
    this.filteredClients = this.resourceForm.get('client')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItemGroup(value))
    );
  }





}
