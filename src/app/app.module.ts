import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ROUTES } from './app.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';


import { ColorBlockModule } from 'ngx-color/block';
import { ColorChromeModule } from 'ngx-color/chrome';
import { MaskPipe, NgxMaskModule } from 'ngx-mask';
import ptBr from '@angular/common/locales/pt';
import { CurrencyPipe , DatePipe, registerLocaleData } from '@angular/common';

import { ApplicationViewComponent } from './shared/components/application-view/application-view.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { HamburguerIconComponent } from './shared/components/hamburguer-icon/hamburguer-icon.component';
import { SideBarComponent } from './shared/components/side-bar/side-bar.component';
import { SideMenuItemComponent } from './shared/components/side-bar/side-menu-item/side-menu-item.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ListViewComponent } from './modules/list-view/list-view.component';
import { ClientsListComponent } from './modules/components/clients/clients-list/clients-list.component';
import { OstypesListComponent } from './modules/components/os_types/ostypes-list/ostypes-list.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DisplayCell } from './shared/pipes/displayCellPipe';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './shared/components/modal/modal.component';
import { PaginationComponent } from './shared/components/pagination/pagination.component';
import { ViewDetailsModalComponent } from './shared/components/modal/view-details-modal/view-details-modal.component';
import { OstypeDetailsComponent } from './modules/components/os_types/ostype-details/ostype-details.component';
import { TicksToTime } from './shared/pipes/ticksToTimePipe';
import { OstypesEditComponent } from './modules/components/os_types/ostypes-edit/ostypes-edit.component';
import { EditViewComponent } from './modules/edit-view/edit-view.component';
import { DurationPickerComponent } from './shared/components/duration-picker/duration-picker.component';
import { DoubleColorPickerComponent } from './shared/components/double-color-picker/double-color-picker.component';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { QuestionnairesListComponent } from './modules/components/questionnaires/questionnaires-list/questionnaires-list.component';
import { QuestionnaireDetailsComponent } from './modules/components/questionnaires/questionnaire-details/questionnaire-details.component';
import { QuestionnairesEditComponent } from './modules/components/questionnaires/questionnaires-edit/questionnaires-edit.component';
import { CollaboratorsListComponent } from './modules/components/collaborators/collaborators-list/collaborators-list.component';
import { AsDate } from './shared/pipes/datePipe';
import { CollaboratorDetailsComponent } from './modules/components/collaborators/collaborator-details/collaborator-details.component';
import { HasValue } from './shared/pipes/hasValuePipe';
import { AsAge } from './shared/pipes/agePipe';
import { AsPhone } from './shared/pipes/phonePipe';
import { CollaboratorsEditComponent } from './modules/components/collaborators/collaborators-edit/collaborators-edit.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxCurrencyModule } from 'ngx-currency';
import { ClientDetailsComponent } from './modules/components/clients/client-details/client-details.component';
import { AsCep } from './shared/pipes/cepPipe';
import { ClientsEditComponent } from './modules/components/clients/clients-edit/clients-edit.component';
import { AgendaComponent } from './modules/components/scheduler/agenda/agenda.component';
import {
  ScheduleModule,
  RecurrenceEditorModule,
  DayService,
  WeekService,
  MonthService,
  TimelineViewsService,
  ResizeService,
  TimelineMonthService,
  DragAndDropService,
} from '@syncfusion/ej2-angular-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import { OsCardComponent } from './modules/components/scheduler/agenda/os-card/os-card.component';
import { IsDarkColor } from './shared/pipes/textContrastPipe';
import { ServiceOrdersEditComponent } from './modules/components/scheduler/service-orders-edit/service-orders-edit.component';
import { SubTimeZone } from './shared/pipes/subTimeZonePipe';
import { LoginViewComponent } from './shared/components/login-view/login-view.component';
import { LoginComponent } from './modules/components/authentication/login/login.component';
import { StocksListComponent } from './modules/components/stock/stocks-list/stocks-list.component';
import { StockEditComponent } from './modules/components/stock/stock-edit/stock-edit.component';
import { MaterialModule } from './shared/components/material/material.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SupplierDetailsComponent } from './modules/components/supplier/supplier-details/supplier-details.component';
import { SupplierEditComponent } from './modules/components/supplier/supplier-edit/supplier-edit.component';
import { SupplierListComponent } from './modules/components/supplier/supplier-list/supplier-list.component';
import { ItemGroupListComponent } from './modules/components/item-group/item-group-list/item-group-list.component';
import { ItemGroupEditComponent } from './modules/components/item-group/item-group-edit/item-group-edit.component';
import { ItemGroupDetailsComponent } from './modules/components/item-group/item-group-details/item-group-details.component';
import { SalesOrderComponent } from './modules/components/sales/sales-order/sales-order-edit.component';
import { DashboardInventoryComponent } from './modules/components/dashboards/dashboard-inventory/dashboard-inventory.component';
import { StockDetailsComponent } from './modules/components/stock/stock-details/stock-details.component';
import { BrandDetailsComponent } from './modules/components/brands/brand-details/brand-details.component';
import { BrandEditComponent } from './modules/components/brands/brand-edit/brand-edit.component';
import { BrandsListComponent } from './modules/components/brands/brands-list/brands-list.component';
import { ServiceDetailsComponent } from './modules/components/service-stock/service-details/service-details.component';
import { ServiceEditComponent } from './modules/components/service-stock/service-edit/service-edit.component';
import { ServiceListComponent } from './modules/components/service-stock/service-list/service-list.component';
import { SalesOrderListComponent } from './modules/components/sales/sales-order-list/sales-order-list.component';
import { SalesOrderDetailsComponent } from './modules/components/sales/sales-order-details/sales-order-details.component';


registerLicense(
  'ORg4AjUWIQA/Gnt2VFhiQldPd11dXmJWd1p/THNYflR1fV9DaUwxOX1dQl9gSXtRcUVkWnZccXNRT2U='
);
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    ApplicationViewComponent,
    HeaderComponent,
    HamburguerIconComponent,
    SideBarComponent,
    SideMenuItemComponent,
    FooterComponent,
    ListViewComponent,
    ClientsListComponent,
    OstypesListComponent,
    DisplayCell,
    TicksToTime,
    HasValue,
    AsDate,
    AsAge,
    AsPhone,
    AsCep,
    IsDarkColor,
    ModalComponent,
    PaginationComponent,
    ViewDetailsModalComponent,
    OstypeDetailsComponent,
    OstypesEditComponent,
    EditViewComponent,
    DurationPickerComponent,
    DoubleColorPickerComponent,
    LoadingComponent,
    QuestionnairesListComponent,
    QuestionnaireDetailsComponent,
    QuestionnairesEditComponent,
    CollaboratorsListComponent,
    CollaboratorDetailsComponent,
    CollaboratorsEditComponent,
    ClientDetailsComponent,
    ClientsEditComponent,
    AgendaComponent,
    OsCardComponent,
    ServiceOrdersEditComponent,
    LoginViewComponent,
    LoginComponent,
    StocksListComponent,
    StockEditComponent,
    SupplierDetailsComponent,
    SupplierEditComponent,
    SupplierListComponent,
    ItemGroupListComponent,
    ItemGroupEditComponent,
    ItemGroupDetailsComponent,
    SalesOrderComponent,
    DashboardInventoryComponent,
    StockDetailsComponent,
    BrandDetailsComponent,
    BrandEditComponent,
    BrandsListComponent,
    ServiceDetailsComponent,
    ServiceEditComponent,
    ServiceListComponent,
    SalesOrderListComponent,
    SalesOrderDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    NgxCurrencyModule,
    ColorBlockModule,
    ColorChromeModule,
    ScheduleModule,
    RecurrenceEditorModule,
    MaterialModule,
    NgxDropzoneModule
  ],
  providers: [
    HttpClient,
    NgbActiveModal,
    MaskPipe,
    DatePipe,
    SubTimeZone,
    IsDarkColor,
    NgxMatNativeDateModule,
    CurrencyPipe,
    { provide: LOCALE_ID, useValue: 'pt' },
    DayService,
    WeekService,
    MonthService,
    TimelineViewsService,
    TimelineMonthService,
    ResizeService,
    DragAndDropService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
