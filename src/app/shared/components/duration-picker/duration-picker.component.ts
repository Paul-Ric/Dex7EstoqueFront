import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-duration-picker',
  templateUrl: './duration-picker.component.html',
  styleUrls: ['./duration-picker.component.scss'],
})
export class DurationPickerComponent {
  hours: string[] = Array.from({ length: 24 }, (_, i) => i.toString()); // generate an array of 0 to 23
  minutes: string[] = Array.from({ length: 60 }, (_, i) => i.toString()); // generate an array of 0 to 59

  selectedHour: string = '0';
  selectedMinute: string = '0';
  @Input() durationValue: string = `${this.padZeroTxt(this.selectedHour)}:${this.padZeroTxt(this.selectedMinute)}`;

  @Output() durationValueChange = new EventEmitter<string>();
  @Output() changeCompleted = new EventEmitter();

  isOpen = false;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {}

  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (propName == 'durationValue') {
        this.inputChange(this.durationValue);
        return;
      }
    }
  }

  togglePicker() {
    this.isOpen = !this.isOpen;
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const isClickInsideButton = this.elementRef.nativeElement
      .querySelector('#pickerButton')
      .contains(event.target);
    const isClickInsidePicker = this.elementRef.nativeElement
      .querySelector('.picker-menu')
      .contains(event.target);
    if (!isClickInsideButton && !isClickInsidePicker) {
      this.isOpen = false;
    }
  }

  selectHour(hour: string) {
    this.selectedHour = this.padZeroTxt(hour);
    this.emitDuration();
  }

  selectMinute(minute: string) {
    this.selectedMinute = this.padZeroTxt(minute);
    this.emitDuration();
  }

  emitDuration() {
    this.durationValue = `${this.padZeroTxt(this.selectedHour)}:${this.padZeroTxt(this.selectedMinute)}`;
    this.durationValueChange.emit(this.durationValue);
  }

  inputChange(text: string) {
    if (text.length <= 3) {
      this.selectedHour = this.padZeroTxt(text);
    } else {
      this.selectedHour = this.padZeroTxt(text.substring(0, 2));
      this.selectedMinute = this.padZeroTxt(text.substring(text.includes(':') ? 3 : 2));
    }
  }

  handleChangeCompleted(){
    this.changeCompleted.emit();
  }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  padZeroTxt(text: string): string {
    return text.length < 2 ? `0${text}` : `${text}`;
  }
}
