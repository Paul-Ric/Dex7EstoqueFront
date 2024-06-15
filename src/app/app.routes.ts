import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { ApplicationViewComponent } from './shared/components/application-view/application-view.component';
import { ClientsListComponent } from './modules/components/clients/clients-list/clients-list.component';
import { OstypesListComponent } from './modules/components/os_types/ostypes-list/ostypes-list.component';
import { OstypesEditComponent } from './modules/components/os_types/ostypes-edit/ostypes-edit.component';
import { QuestionnairesListComponent } from './modules/components/questionnaires/questionnaires-list/questionnaires-list.component';
import { QuestionnairesEditComponent } from './modules/components/questionnaires/questionnaires-edit/questionnaires-edit.component';
import { CollaboratorsListComponent } from './modules/components/collaborators/collaborators-list/collaborators-list.component';
import { CollaboratorsEditComponent } from './modules/components/collaborators/collaborators-edit/collaborators-edit.component';
import { ClientsEditComponent } from './modules/components/clients/clients-edit/clients-edit.component';
import { AgendaComponent } from './modules/components/scheduler/agenda/agenda.component';
import { ServiceOrdersEditComponent } from './modules/components/scheduler/service-orders-edit/service-orders-edit.component';
import { LoginViewComponent } from './shared/components/login-view/login-view.component';
import { LoginComponent } from './modules/components/authentication/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { StocksListComponent } from './modules/components/stock/stocks-list/stocks-list.component';
import { StockEditComponent } from './modules/components/stock/stock-edit/stock-edit.component';
import { SupplierListComponent } from './modules/components/supplier/supplier-list/supplier-list.component';
import { SupplierEditComponent } from './modules/components/supplier/supplier-edit/supplier-edit.component';
import { ItemGroupListComponent } from './modules/components/item-group/item-group-list/item-group-list.component';
import { ItemGroupEditComponent } from './modules/components/item-group/item-group-edit/item-group-edit.component';
import { SalesOrderComponent } from './modules/components/sales/sales-order/sales-order-edit.component';
import { DashboardInventoryComponent } from './modules/components/dashboards/dashboard-inventory/dashboard-inventory.component';
import { BrandsListComponent } from './modules/components/brands/brands-list/brands-list.component';
import { BrandEditComponent } from './modules/components/brands/brand-edit/brand-edit.component';
import { ServiceListComponent } from './modules/components/service-stock/service-list/service-list.component';
import { ServiceEditComponent } from './modules/components/service-stock/service-edit/service-edit.component';
import { SalesOrderListComponent } from './modules/components/sales/sales-order-list/sales-order-list.component';

// components

export const ROUTES: Routes = [
  { path: '**', redirectTo: 'invalid-url' },
  {
    path: '',
    component: LoginViewComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'app',
    component: ApplicationViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'tipos-de-os',
        children: [
          {
            path: 'listar',
            component: OstypesListComponent,
          },
          {
            path: 'editar/:id',
            component: OstypesEditComponent,
          },
          {
            path: 'criar',
            component: OstypesEditComponent,
          },
        ],
      },
      {
        path: 'questionarios',
        children: [
          {
            path: 'listar',
            component: QuestionnairesListComponent,
          },
          {
            path: 'editar/:id',
            component: QuestionnairesEditComponent,
          },
          {
            path: 'criar',
            component: QuestionnairesEditComponent,
          },
        ],
      },
      {
        path: 'colaboradores',
        children: [
          {
            path: 'listar',
            component: CollaboratorsListComponent,
          },
          {
            path: 'editar/:id',
            component: CollaboratorsEditComponent,
          },
          {
            path: 'criar',
            component: CollaboratorsEditComponent,
          },
        ],
      },
      {
        path: 'clientes',
        children: [
          {
            path: 'listar',
            component: ClientsListComponent,
          },
          {
            path: 'editar/:id',
            component: ClientsEditComponent,
          },
          {
            path: 'criar',
            component: ClientsEditComponent,
          },
        ],
      },
      {
        path: 'agendamento',
        children: [
          {
            path: 'agendar',
            component: AgendaComponent,
          },
          {
            path: 'criar-os',
            component: ServiceOrdersEditComponent,
            data: {
              mapParams: true,
            },
          },
          {
            path: 'editar-os/:id',
            component: ServiceOrdersEditComponent,
          },
        ],
      },
      {
        path: 'estoque',
        children: [
          {
            path: 'produtos',
            component: StocksListComponent
          },
          {
            path: 'criar-produtos',
            component: StockEditComponent
          },
          {
            path:'editar-produto/:id',
            component:StockEditComponent
          }
        ],
      },
      {
        path: 'fornecedores',
        children: [
          {
            path: 'lista',
            component: SupplierListComponent
          },
          {
            path: 'criar-fornecedor',
            component: SupplierEditComponent
          },
          {
            path: 'editar-fornecedor/:id',
            component: SupplierEditComponent,
          },
        ],
      },
      {
        path:'grupo-itens',
        children:[
          {
            path:'lista',
            component:ItemGroupListComponent
          },
          {
            path:'criar-grupo',
            component:ItemGroupEditComponent
          },
          {
            path:'editar-grupo/:id',
            component:ItemGroupEditComponent
          }
        ]
      },
      {
        path:'marcas',
        children:[
          {
            path:'lista',
            component:BrandsListComponent
          },
          {
            path:'criar-marca',
            component:BrandEditComponent
          },
          {
            path:'editar-marca/:id',
            component:BrandEditComponent
          }
        ]
      },
      { path:'servico',
        children:[
          {
            path:'lista',
            component:ServiceListComponent,
          },
          {
            path:'criar-servico',
            component:ServiceEditComponent
          },
          {
            path:'editar-servico/:id',
            component:ServiceEditComponent
          }
        ]
      },
      {
        path:'vendas',
        children:[
          {
            path:'criar-ordem-venda',
            component:SalesOrderComponent
          },
          {
            path:'lista',
            component:SalesOrderListComponent
          }
        ]
      },
      {
        path:'dashboard',
        children:[
          {
            path:'relatorio-inventario',
            component:DashboardInventoryComponent
          }
        ]
      },

      { path: '', redirectTo: 'agendamento/agendar', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class RoutingModule { }
