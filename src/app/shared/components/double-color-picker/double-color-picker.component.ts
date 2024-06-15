import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { ColorEvent } from 'ngx-color';

@Component({
  selector: 'app-double-color-picker',
  templateUrl: './double-color-picker.component.html',
  styleUrls: ['./double-color-picker.component.scss'],
})
export class DoubleColorPickerComponent {
  constructor(private elementRef: ElementRef) {}

  userOpened: boolean = false;

  @Input() isOpen!: boolean;
  @Output() isOpenChange = new EventEmitter<boolean>();

  @Input() currentColorHexCode: string = '#000000';
  @Output() currentColorHexCodeChange = new EventEmitter<string>();
  @Output() changeCompleted = new EventEmitter();
  @Input() colorBlocks: Array<string> = [
    '#D6403C',
    '#FF6961',
    '#D57E2C',
    '#FFB347',
    '#B5B533',
    '#dce775',
    '#FFFF99',
    '#63B963',
    '#37D67A',
    '#98FB98',
    '#BDFCC9',
    '#68BDB2',
    '#2CCCE4',
    '#D0FFF7',
    '#5D98E8',
    '#80a6d3',
    '#D9E3F0',
    '#697689',
    '#8B668B',
    '#ba68c8',
    '#F5E1F7',
  ];


  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (propName == 'isOpen' && this.isOpen) {
        setTimeout(() => {
          this.userOpened = true;
        }, 300);
        return;
      }
    }
  }

  handleChange(e: ColorEvent) {
    this.currentColorHexCode = e.color.hex;
    this.currentColorHexCodeChange.emit(this.currentColorHexCode);
  }

  handleChangeCompleted(){
    this.changeCompleted.emit();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const isClickInsidePanel = this.elementRef.nativeElement.contains(event.target);
    if (!isClickInsidePanel && this.userOpened) {
      this.isOpen = false;
      this.userOpened = false;
      this.isOpenChange.emit(this.isOpen);
    }
  }
}
