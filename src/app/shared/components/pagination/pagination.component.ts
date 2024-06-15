import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalCount: number = 1;
  @Input() pageSize: number = 10;
  @Output() pageSelectedEvent: EventEmitter<number> =
    new EventEmitter<number>();

  maxPages: number = 1;
  visiblePages: number[] = [1];

  ngOnChanges(changes: any) {
    for (const propName in changes) {
      if (propName == 'totalCount' || propName == 'currentPage') {
        this.updatePages();
        return;
      }
    }
  }

  updatePages(){
    this.maxPages = Math.ceil(this.totalCount / this.pageSize);
    this.visiblePages = this.createNumberArray(1, Math.min(5, this.maxPages));
  }

  navigate(pageNumber: number) {
    if (pageNumber < 1 || pageNumber > this.maxPages) return;
    this.currentPage = pageNumber;
    this.visiblePages = this.createNumberArray(
      Math.max(
        this.currentPage -
          2 -
          (this.currentPage > this.maxPages - 3
            ? 2 - (this.maxPages - this.currentPage)
            : 0),
        1
      ),
      Math.min(
        this.currentPage +
          2 +
          (this.currentPage < 4 ? 3 - this.currentPage : 0),
        this.maxPages
      )
    );
    this.pageSelectedEvent.emit(pageNumber);
  }

  createNumberArray(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => index + start);
  }
}
