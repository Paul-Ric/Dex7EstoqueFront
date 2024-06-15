import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-side-menu-item',
  templateUrl: './side-menu-item.component.html',
  styleUrls: ['./side-menu-item.component.scss'],
})
export class SideMenuItemComponent {
  @Input() iconName: string = '';
  @Input() rightIconName: string = '';
  @Input() label: string = '';
  @Input() isDropdown: boolean = false;
  @Input() isOpened: boolean = false;
  @Input() isDisabled: boolean = false;
  @Input() heightScale: number = 1;
  @Output() onClickEmitter: EventEmitter<undefined> = new EventEmitter();
  @Output() onRightIconClickEmitter: EventEmitter<undefined> = new EventEmitter();

  onClick() {
    if (this.isDisabled) return;

    if (this.isDropdown) this.toggle();

    this.onClickEmitter.emit();
  }

  onRightIconClick(event: any){
    event.stopPropagation();
    if (this.isDisabled) return;

    this.onRightIconClickEmitter.emit();
  }

  toggle() {
    const content = document.getElementById('content_' + this.label);
    if (this.isOpened) {
      content!.style.maxHeight = '0px';
    } else {
      content!.style.maxHeight = (content!.scrollHeight*2) + 'px';
    }
    this.isOpened = !this.isOpened;
  }
}
