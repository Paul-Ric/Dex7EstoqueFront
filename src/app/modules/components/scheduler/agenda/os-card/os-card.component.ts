import { Component, EventEmitter, Input, ElementRef } from '@angular/core';
import { ResizeEventArgs } from '@syncfusion/ej2-angular-schedule';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-os-card',
  templateUrl: './os-card.component.html',
  styleUrls: ['./os-card.component.scss'],
})
export class OsCardComponent {
  @Input() data: any;
  @Input() resizeEvent: EventEmitter<ResizeEventArgs> = new EventEmitter();

  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    const osTypeColorHex = '#' + this.data?.osTypeColorHex || '#000000';
    const card = document.querySelectorAll(
      `[data-id="Appointment_${this.data.Id}"]`
    )[0] as HTMLElement;
    card.style.backgroundColor = osTypeColorHex;

    this.resizeEvent.subscribe((args: ResizeEventArgs) => this.onResize(args));
  }

  public onResize(args: ResizeEventArgs): void {
    if(args.data["Id"] != this.data.Id) return;
    this.data.StartTime = new Date(args.startTime!);
    this.data.EndTime = new Date(args.endTime!);
    const clone = document.querySelectorAll(`[data-id="Appointment_${this.data.Id}"].e-schedule-event-clone`)[0];
    const startTime = clone.querySelectorAll('.startTimeValue')[0];
    const endTime = clone.querySelectorAll('.endTimeValue')[0];

    startTime.innerHTML = this.datePipe.transform(this.data.StartTime,'HH:mm')!;
    endTime.innerHTML = this.datePipe.transform(this.data.EndTime, 'HH:mm')!;
  }
}
