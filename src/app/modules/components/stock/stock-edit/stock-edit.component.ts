import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StockFacade } from '../stock.facade';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalMessage } from 'src/app/shared/enums/modal-message';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { ModalService } from 'src/app/shared/services/modal/modal.service';
import { ProductPost } from 'src/app/shared/services/stock/models/product.post.model';
import { Observable, Subscription, first, map, startWith } from 'rxjs';
import { GetBrandList } from 'src/app/shared/services/brand/models/brand-list.model';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GetSupplierList } from 'src/app/shared/services/supplier/models/supplier-list.model';
import { Unit } from 'src/app/shared/services/stock/models/unit.enum';
import ItemGroupList, { GetItemGroupList } from 'src/app/shared/services/item-group/models/item-group-list.model';
import { StockService } from 'src/app/shared/services/stock/stock.service';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ProductPut } from 'src/app/shared/services/stock/models/product.put.model';
import { ProductMovementPost } from 'src/app/shared/services/stock/models/product-movement.post.model';
import { ProductMovementResponse } from 'src/app/shared/services/stock/models/product-movement-response.model';
import ProductMovementList, { GetProductMovementList } from 'src/app/shared/services/stock/models/product-movement-list.model';

@Component({
  selector: 'app-stock-edit',
  templateUrl: './stock-edit.component.html',
  styleUrls: ['./stock-edit.component.scss']
})
export class StockEditComponent {
  resourceForm: FormGroup;
  isCreatePage: boolean = false;
  hasChanges = false;
  imageProduct: string
  remainingChars = 50;
  profilePictureUrl: any
  files: File[] = [];
  filteredBrands: Observable<GetBrandList[]>;
  filteredSupplier: Observable<GetSupplierList[]>;
  filteredItemGroup:Observable<GetItemGroupList[]>
  maxDisplayedOptions = 3;
  currentDisplayedOptions = 3;
  selectedUnit: number;
  units = Unit;
  id:any
  brandId:number
  supplierId:number
  item:number
  image:File | null
  private subscription: Subscription;
  dataMovement:Array<GetProductMovementList>=[]



  constructor(
    public facade: StockFacade,
    public activedRoute: ActivatedRoute,
    private form: FormBuilder,
    public layout: ResponsiveLayoutService,
    private router: Router,
    public stock:StockService,
    public activeRoute: ActivatedRoute
  ) {
    if (this.facade.getRouteUrl().endsWith('criar-produtos')) {
      this.isCreatePage = true;
      this.facade.loadingService.clear();
      return;
    }
    this.facade.loadingService.set(ModalMessage.LOADING_WAIT);
  }
  ngOnInit() {
    this.createForm()
    this.facade.listBrands()
    this.facade.listSupplier()
    this.facade.listItemGroup()
    this.filteredBrands = this.resourceForm.get('brandId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBrands(value))
    );
    this.filteredSupplier = this.resourceForm.get('supplierId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSupplier(value))
    );
    this.filteredItemGroup = this.resourceForm.get('groupCategoryId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItemGroup(value))
    );
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
          this.facade.GetProductImage(id).subscribe
            ((res)=>{
              if(res.success){
                this.profilePictureUrl = res.data ?? '';
              }
            })
          this.facade.GetMovement(id).subscribe(
            (res)=>{this.dataMovement=res.data!
               console.log(res)}
          )
      }
    });
    this.resourceForm.valueChanges.subscribe(() => {
      this.hasChanges = true;
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  public createForm(): void {
    this.resourceForm = this.form.group({
      name: [null, Validators.required],//
      code: [null, Validators.required],//
      barcode: [null, Validators.required],//
      ncm: [null, Validators.required],//
      unit: [null, Validators.required],
      sku: [null, Validators.required],//
      productPhysicalLocation: [null, Validators.required],//
      minimumStock: [null, Validators.required],//
      maximumStock: [null, Validators.required],//
      updatedDate: [null, Validators.required],
      costValue: [null, Validators.required],//
      cashValue: [null, Validators.required],//
      termValue: [null, Validators.required],//
      wholesaleValue: [null, Validators.required],//
      currentQuantity: [null, Validators.required],//
     // image: [null, Validators.required],//
      brandId: [null, Validators.required],
      groupCategoryId: [null, Validators.required],
      supplierId: [null, Validators.required]
    })
  }
  private filterBrands(value: string | GetBrandList): GetBrandList[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : '');

    if (typeof value === 'string') {
      return this.facade.currentBrandList.filter(brand =>
        brand.fantasyName.toLowerCase().includes(filterValue)
      ).slice(0, this.currentDisplayedOptions);
    }

    return this.facade.currentBrandList.filter(brand =>
      brand.fantasyName.toLowerCase().includes(filterValue)
    ).slice(0, this.currentDisplayedOptions);
  }
  private filterSupplier(value: string | GetSupplierList): GetSupplierList[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : (value && value.name) ? value.name.toLowerCase() : '');
    const filteredSupplier = this.facade.currentSupplierList.filter(supplier =>
      supplier.name.toLowerCase().includes(filterValue)
    );
    return filteredSupplier.slice(0, this.currentDisplayedOptions);
  }
  private filterItemGroup(value: string | GetItemGroupList): GetItemGroupList[] {
    const filterValue = (typeof value === 'string' ? value.toLowerCase() : '');

    if (typeof value === 'string') {
      return this.facade.currentItemGroupList.filter(supplier =>
        supplier.name.toLowerCase().includes(filterValue)
      ).slice(0, this.currentDisplayedOptions);
    }

    return this.facade.currentItemGroupList.filter(supplier =>
      supplier.name.toLowerCase().includes(filterValue)
    ).slice(0, this.currentDisplayedOptions);
  }
  public displayBrand(brand: GetBrandList):string {
    return brand ? brand.fantasyName: ''
  }
  public displaySupllier(supplier: GetSupplierList): string {
    return supplier ? supplier.name : '';
  }
  public displayItemGroup(item: GetItemGroupList): string {
    return item ? item.name : '';
  }
  public loadMoreOptionsBrand() {
    this.currentDisplayedOptions += this.maxDisplayedOptions;
    this.filteredBrands = this.resourceForm.get('brandId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterBrands(value))
    );
  }
  public loadMoreOptionsSupplier() {
    this.currentDisplayedOptions += this.maxDisplayedOptions;
    this.filteredSupplier = this.resourceForm.get('supplierId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterSupplier(value))
    );
  }
  public loadMoreOptionsItemGroup() {
    this.currentDisplayedOptions += this.maxDisplayedOptions;
    this.filteredItemGroup = this.resourceForm.get('groupCategoryId')!.valueChanges.pipe(
      startWith(''),
      map(value => this.filterItemGroup(value))
    );
  }
  public onSelectChange(event:any) {
    // Método chamado quando o valor do mat-select é alterado
    console.log('Valor selecionado:', this.resourceForm.value);
  }
  public onBrandSelection(event: any) {
    const selectedBrand = event.option.value as GetBrandList;
    const selectedBrandId = selectedBrand.id;
    this.brandId= selectedBrandId
    console.log('Brand ID:',selectedBrandId)
  }
  public onSupplierSelection(event: any) {
    const selectedSupplier = event.option.value as GetSupplierList;
    const selectedSupplierId = selectedSupplier.id;
    this.supplierId=selectedSupplierId
    console.log('Supplier ID:', selectedSupplierId);
  }
  public onItemSelection(event: any) {
    const selectedItem = event.option.value as GetItemGroupList;
    const selectedItemId = selectedItem.id;
    this.item=selectedItemId
    console.log('Item ID:', selectedItemId);
  }
  public onSelect(event: any) {
    console.log(event);
    this.files.push(...event.addedFiles);
  }
  public onRemove(event: any) {
    console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
  }
  public onFileChange(event: any) {
    const inputElement: HTMLInputElement = event.target;
    const file: File | null =
      inputElement.files && inputElement.files.length > 0
        ? inputElement.files[0]
        : null;

    if (file) {
      const allowedExtensions = ['png', 'jpg', 'jpeg'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension && allowedExtensions.includes(fileExtension)) {
        this.image = file;
        console.log('Form Value with Image:', this.image);
        const reader = new FileReader();
        reader.onload = () => {
          this.profilePictureUrl = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.facade.modalService.invalidFileExtension(allowedExtensions);
        inputElement.value = '';
      }
    }
    console.log(this.resourceForm.value.image)
  }
  public promptDeleteImage() {
    this.facade.modalService.confirmDelete(
      'a imagem de perfil',
      () => {
        this.image = null;
        this.profilePictureUrl = '';
      },
      () => { }
    );
  }
  public onSave(){
    this.facade.loadingService.set(ModalMessage.PROCESSING_WAIT);
    if(this.isCreatePage){
      this.resourceForm.get('brandId')?.setValue(this.brandId)
      this.resourceForm.get('supplierId')?.setValue(this.supplierId)
      this.resourceForm.get('groupCategoryId')?.setValue(this.item)
      console.log(this.resourceForm.value)
      this.postProduct(this.resourceForm.value)
    }
    else{
      this.resourceForm.get('brandId')?.setValue(this.brandId)
      this.resourceForm.get('supplierId')?.setValue(this.supplierId)
      this.resourceForm.get('groupCategoryId')?.setValue(this.item)
      const putProduct:ProductPut={
        id: this.id,
        code: this.resourceForm.value.code,
        barcode: this.resourceForm.value.barcode,
        ncm: this.resourceForm.value.ncm,
        name:this.resourceForm.value.name,
        unit: this.resourceForm.value.unit,
        sku: this.resourceForm.value.sku,
        productPhysicalLocation: this.resourceForm.value.productPhysicalLocation,
        minimumStock: this.resourceForm.value.minimumStock,
        maximumStock: this.resourceForm.value.maximumStock,
        updatedDate: this.resourceForm.value.updatedDate,
        costValue: this.resourceForm.value.costValue,
        cashValue: this.resourceForm.value.cashValue,
        termValue: this.resourceForm.value.termValue,
        wholesaleValue: this.resourceForm.value.wholesaleValue,
        currentQuantity: this.resourceForm.value.currentQuantity,
        brandId: this.resourceForm.value.brandId,
        groupCategoryId: this.resourceForm.value.groupCategoryId,
        supplierId: this.resourceForm.value.supplierId,
        productImage:this.image
      }
      console.log(putProduct)
      this.putProduct(putProduct)
    }
  }
  public postProduct(post: ProductPost) {
    this.facade.postProduct(post).subscribe(
      (res)=>{
          if(res.success){
            const postMovement:ProductMovementPost={productId:res.data?.id,dateMoviment:new Date(),movementType:1,quantity:this.resourceForm.value.currentQuantity}
            this.postProductMovement(postMovement)
          if(this.image != null){
            this.id=res.data?.id
            console.log(this.id)
            this.postPicture(this.id.value,this.image)
          }else{
            this.facade.modalService.successfullCreate();
            this.facade.location.back();
          }
        }
      },(error)=>{
        console.log(error)
        this.facade.modalService.defaultError(ModalComponent);
      },()=>{this.facade.loadingService.clear();}
    )
  }
  public postProductMovement(post:ProductMovementPost){
    this.facade.PostMovement(post).subscribe(
      (res)=>{},
      ((error)=>{console.error(error)})
    )
  }
  public postPicture(productId:number,file:File){
    this.stock.PostImage(productId,file).subscribe(
      (res)=>{
        console.log(res)
        this.facade.modalService.successfullCreate();
        this.facade.location.back();
      },(error)=>{
        console.log(error)
        this.facade.modalService.defaultError(ModalComponent)
        return error
    },()=>this.facade.loadingService.clear()
    )
  }
  public putProduct(put:ProductPut){
    this.facade.PutProduct(put).subscribe
    ((res) => {
      if (res.success) {
        if(this.resourceForm.value.image != null){
          this.id.setValue(res.data?.id ?? 0);
          this.postPicture(this.id.value,this.resourceForm.value.image)
          this.facade.modalService.successfulUpdate();
        this.facade.location.back();
        }else{
          /*if(this.image == null &&
            this.image == ''){
              this.deleteImage()
                this.facade.modalService.successfulUpdate();
                  this.facade.location.back();
            }else{
              this.facade.modalService.successfulUpdate();
              this.facade.location.back();
            }*/
        }

      }
    },(err:HttpErrorResponse)=>{
      if(err.status == 400)
      this.facade.modalService.listErrors(err.error.errors);
      else {
        this.facade.modalService.defaultError(ModalComponent);
      }
    },(()=>{this.facade.loadingService.clear()}))
  }
  deleteProduct(id:number){
    this.facade.DeleteProduct(id)
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
  deleteImage(){
    return this.facade.DeleteImageProduct(this.id).subscribe(
      (res)=>{return res},
      (error)=>{this.facade.modalService.defaultError(ModalComponent);
        return error;},
      ()=>{this.facade.loadingService.clear();}
    )
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
      "esta 'Produto'",
      () => {
        this.deleteProduct(this.id);
      },
      () => {}
    );
  }



}
