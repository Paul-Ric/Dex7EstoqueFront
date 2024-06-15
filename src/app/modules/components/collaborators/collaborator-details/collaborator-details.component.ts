import { Component, EventEmitter, Input, Output } from '@angular/core';
import Collaborator from 'src/app/shared/services/collaborator/models/collaborator';
import { ResponsiveLayoutService } from 'src/app/shared/services/responsive-layout/layout.service';
import { CollaboratorsFacade } from '../collaborators.facade';

@Component({
  selector: 'app-collaborator-details',
  templateUrl: './collaborator-details.component.html',
  styleUrls: ['./collaborator-details.component.scss'],
})
export class CollaboratorDetailsComponent {
  constructor(
    public facade: CollaboratorsFacade
  ) {}

  docsOpened = false;
  addressOpened = false;
  contactOpened = false;
  profilePictureUrl = '';

  @Input() data: Collaborator = new Collaborator();

  @Output() editClickEvent = new EventEmitter<number>();

  ngOnInit(){
    this.facade.GetProfilePictureUrl(this.data.id).then((res) => {
      if (res.success) {
        this.profilePictureUrl = res.data ?? '';
      }
    });
  }

  onEditClick(id: number) {
    this.editClickEvent.emit(id);
  }

}
