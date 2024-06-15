import { Component, EventEmitter, ViewChild } from '@angular/core';
import {
  ActionEventArgs,
  CellClickEventArgs,
  DragEventArgs,
  EventRenderedArgs,
  EventSettingsModel,
  GroupModel,
  PopupOpenEventArgs,
  RenderCellEventArgs,
  ScheduleComponent,
  TimeScaleModel,
  ToolbarActionArgs,
} from '@syncfusion/ej2-angular-schedule';
import { removeClass } from '@syncfusion/ej2-base';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { ServiceOrdersFacade } from '../service-order.facade';
import { GetServiceOrderListed } from 'src/app/shared/services/service-order/models/service-order_list.response';
import { ResizeEventArgs } from '@syncfusion/ej2-angular-schedule';
import { SubTimeZone } from 'src/app/shared/pipes/subTimeZonePipe';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import { IsDarkColor } from 'src/app/shared/pipes/textContrastPipe';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.scss'],
})
export class AgendaComponent {
  @ViewChild('osScheduler') osScheduler!: ScheduleComponent;
  public resizeEvent: EventEmitter<ResizeEventArgs> = new EventEmitter();

  public selectedDate: Date = new Date();
  public startHour: string = '08:00';
  public endHour: string = '19:00';
  public timeScale: TimeScaleModel = {
    enable: true,
    interval: 60,
    slotCount: 6,
  };
  public group: GroupModel = {
    allowGroupEdit: false,
    resources: ['Colaboradores'],
  };
  public collaborators: Object[] = [];
  public serviceOrders: Array<any> = [];

  public eventSettings: EventSettingsModel = {
    dataSource: this.serviceOrders,
  };

  constructor(
    public osFacade: ServiceOrdersFacade,
    private subTimeZonePipe: SubTimeZone,
    private isDarkColorPipe: IsDarkColor
  ) {
    this.osFacade.setLoading('Carregando Ordens de Serviço, aguarde...');
  }

  ngOnInit() {
    this.loadDateRangeOs(this.selectedDate, this.selectedDate);
    this.loadCollaborators();
  }

  loadDateRangeOs(start: Date, end: Date) {
    this.osFacade.setLoading('Carregando Ordens de Serviço, aguarde...');
    this.osFacade
      .getByDateRange(start, end)
      .then((res) => {
        this.serviceOrders = res.data!.map((os: GetServiceOrderListed) => {
          return {
            Id: os.id,
            Subject: os.description,
            StartTime: os.startDate,
            EndTime: os.expectedCompletionDate,
            Location: os.clientAddress,
            collaboratorId: os.collaboratorId,
            clientName: os.clientName,
            osTypeColorHex: os.osTypeColorHex,
          };
        });
      })
      .finally(() => {
        this.osFacade.clearLoading();
        this.eventSettings = {
          dataSource: this.serviceOrders,
        };
      });
  }

  loadCollaborators() {
    this.osFacade.setLoading('Carregando Ordens de Serviço, aguarde...');
    this.osFacade
      .GetSchedulerCollaboratorsList()
      .then((res) => {
        this.collaborators = res.data!;
      })
      .finally(() => {
        this.osFacade.clearLoading();
      });
  }

  promptDeleteOs(osId: number) {
    this.osFacade.modalService.confirmDelete(
      "esta 'Ordem de Serviço'",
      () => {
        this.deleOs(osId);
      },
      () => {}
    );
  }

  deleOs(id: number) {
    this.osFacade
      .delete(id)
      .then((res) => {
        if (res.success) {
          this.osFacade.modalService.successfulDelete();
          this.loadDateRangeOs(this.selectedDate, this.selectedDate);
        }
      })
      .catch((err: HttpErrorResponse) => {
        if (err.status == 400)
          this.osFacade.modalService.listErrors(err.error.errors);
        else {
          this.osFacade.modalService.defaultError(ModalComponent);
        }
      })
      .finally(() => {
        this.osFacade.loadingService.clear();
      });
  }

  public onResize(args: ResizeEventArgs): void {
    this.resizeEvent.emit(args);
  }

  public onResizeStop(args: ResizeEventArgs): void {
    this.osFacade.setLoading('Reagendando Ordem de Serviço, aguarde...');
    this.osFacade
      .reschedule(
        args.data['Id'],
        args.data['collaboratorId'],
        this.subTimeZonePipe.transform(args.data['StartTime']),
        this.subTimeZonePipe.transform(args.data['EndTime'])
      )
      .finally(() => {
        this.osFacade.clearLoading();
      });
  }

  onDragStop(args: DragEventArgs): void {
    this.osFacade.setLoading('Reagendando Ordem de Serviço, aguarde...');
    this.osFacade
      .reschedule(
        args.data['Id'],
        args.data['collaboratorId'],
        this.subTimeZonePipe.transform(args.data['StartTime']),
        this.subTimeZonePipe.transform(args.data['EndTime'])
      )
      .finally(() => {
        this.osFacade.clearLoading();
      });
  }

  onCellDoubleClick(
    args: CellClickEventArgs,
    osScheduler: ScheduleComponent
  ): void {
    const collaboratorId = osScheduler.getResourcesByIndex(args.groupIndex!)
      .groupData!['collaboratorId'];

    this.osFacade.openNewOs(args.startTime, collaboratorId);
  }

  onEventDoubleClick(data: any, e: any) {
    this.osFacade.openEditOs(data['Id']);
  }

  onPopupOpen(args: PopupOpenEventArgs) {
    let isEmptyCell =
      args.target?.classList.contains('e-work-cells') ||
      args.target?.classList.contains('e-header-cells'); // checking whether the cell is empty or not

    if (args.type === 'DeleteAlert') {
      args.cancel = true;
      this.promptDeleteOs(args.data!['Id']);
    }

    if ((args.type === 'QuickInfo' && isEmptyCell) || args.type === 'Editor') {
      args.cancel = true;
    } else if (args.type === 'QuickInfo' && !isEmptyCell) {
      const cardColor = args.data!['osTypeColorHex'];
      const textColor = this.isDarkColorPipe.transform(cardColor)
        ? '#fff'
        : '#000';

      const btnEdit = args.element.querySelectorAll(
        '.e-edit'
      )[0] as HTMLElement;
      btnEdit.style.color = textColor;
      btnEdit.addEventListener('click', () => {
        this.osFacade.openEditOs(args.data!['Id']);
      });

      const btnDelete = args.element.querySelectorAll(
        '.e-delete'
      )[0] as HTMLElement;
      btnDelete.style.color = textColor;
      const btnClose = args.element.querySelectorAll(
        '.e-close'
      )[0] as HTMLElement;
      btnClose.style.color = textColor;
      const txtSubject = args.element.querySelectorAll(
        '.e-subject'
      )[0] as HTMLElement;
      txtSubject.style.color = textColor;

      if (
        !args.element.querySelector('.status-row') &&
        args.target!.classList.contains('e-appointment')
      ) {
        const client = document.createElement('div');
        client.className = 'client';
        client.style.paddingTop = '16px';
        client.style.fontSize = '12px';
        client.style.display = 'flex';
        client.style.alignItems = 'center';

        const clientIcon = document.createElement('i');
        clientIcon.className = 'material-icons';
        clientIcon.style.fontSize = '18px';
        clientIcon.style.color = 'rgba(0,0,0,.54)';
        clientIcon.style.marginRight = '13px';
        clientIcon.innerHTML = 'person';

        const clientName = document.createElement('div');
        clientName.className = 'e-resource-details e-text-ellipsis';
        clientName.innerHTML = args.data!['clientName'];

        client.append(clientIcon);
        client.append(clientName);

        const contentElement: HTMLElement = <HTMLElement>(
          args.element.querySelector('.e-popup-content')
        );
        contentElement.insertBefore(client, contentElement.children[1]);
      }
    }
  }

  onRenderCell(args: RenderCellEventArgs): void {
    if (args.elementType === 'dateHeader') {
      // prevents the abillity to create a new OS from the date header
      removeClass(args.element.childNodes, 'e-navigate');
    }
  }

  public onEventRendered(args: EventRenderedArgs) {
    args.element.addEventListener(
      'dblclick',
      this.onEventDoubleClick.bind(this, args.data)
    );
  }

  onActionBegin(args: ActionEventArgs & ToolbarActionArgs): void {
    if (args.requestType === 'toolbarItemRendering') {
      // adds a button to the scheduler header
      let btnNewOs: ItemModel = {
        align: 'Left',
        text: 'Nova OS',
        cssClass: 'btnNewOs',
      };
      args.items?.splice(3, 0, btnNewOs);
    }
  }

  onActionComplete(args: ActionEventArgs): void {
    if (args.requestType === 'toolBarItemRendered') {
      let btnNewOs: HTMLElement = this.osScheduler.element.querySelector(
        '.btnNewOs'
      ) as HTMLElement;
      btnNewOs.onclick = () => {
        this.osFacade.openNewOs();
      };
    }

    if (
      args.requestType === 'viewNavigate' ||
      args.requestType === 'dateNavigate'
    ) {
      const currentViewDates = this.osScheduler.getCurrentViewDates();
      const startDate = currentViewDates[0];
      const endDate = currentViewDates[currentViewDates.length - 1];

      this.loadDateRangeOs(startDate, endDate);
    }
  }
}
