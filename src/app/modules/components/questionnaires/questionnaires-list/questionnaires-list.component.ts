import { Component } from '@angular/core';
import { QuestionnairesFacade } from '../questionnaires.facade';

@Component({
  selector: 'app-questionnaires-list',
  templateUrl: './questionnaires-list.component.html',
  styleUrls: ['./questionnaires-list.component.scss'],
})
export class QuestionnairesListComponent {
  constructor(public facade: QuestionnairesFacade) {}

  ngOnInit() {
    this.facade.loadListView().finally(() => {
      this.facade.loading = false;
    });
  }

  onSearchChange(text: string) {
    this.facade.searchText = text;
    this.facade.searchList(1, text);
  }

  onViewDetailsClick(id: number) {
    this.facade.openViewDetails(id);
  }

  onBtnAddClick() {
    this.facade.openNewOs();
  }

  onEditClick(id: number) {
    this.facade.openEditQuestionnaire(id);
  }

  onPageSelected(page: number) {
    this.facade.searchList(page, this.facade.searchText);
  }
}
