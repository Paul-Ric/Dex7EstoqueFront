import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';

@Component({
  selector: 'app-edit-view',
  templateUrl: './edit-view.component.html',
  styleUrls: ['./edit-view.component.scss'],
})
export class EditViewComponent {
  constructor(
    public layout: ResponsiveLayoutService,
    public router: Router
  ) {}
  @Input() title: string = '';
  @Input() isCreatePage: boolean = false;
  @Input() saveEnabled: boolean = true;
  @Input() discardEnabled: boolean = false;

  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onClearFields = new EventEmitter();
  @Output() onDiscard = new EventEmitter();

  onCancelClick() {
    this.onCancel.emit();
  }
  onSaveClick() {
    this.onSave.emit();
  }
  onDeleteClick() {
    this.onDelete.emit();
  }
  onClearFieldsClick(){
    this.onClearFields.emit();
  }
  onDiscardClick(){
    this.onDiscard.emit();
  }
}
