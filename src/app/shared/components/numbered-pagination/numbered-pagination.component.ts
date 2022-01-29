import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";

import { NumberedPagination } from "./numbered-pagination.interface";
import { RulerFactoryOption } from "./numbered-pagination.enum";

@Component({
  selector: "numbered-pagination",
  templateUrl: "./numbered-pagination.component.html",
  styleUrls: ["./numbered-pagination.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberedPaginationComponent implements OnInit {
  // last page number
  // calculate based on passed input values
  maxPages: number = 0;

  // dynamic index allows pagination to be defined by route
  @Input() index: number = 1; // active page
  @Input() totalCount: number = 100; // total number of items
  @Input() pageSize: number = 5; // results per page
  // for a symmetrical ruler, use following assignment to make rulerLength even
  // rulerLength = rulerLength % 2 === 0 ? rulerLength + 1 : rulerLength
  @Input() rulerLength: number = 5; // page displayed in ruler

  @Output() page: EventEmitter<number> = new EventEmitter<number>();

  ruler = (
    currentIndex: number,
    maxPages: number,
    rulerLength: number
  ): number[] => {
    const arr = new Array(rulerLength).fill(null);
    // variable to container movement behavior options
    // this ruler has 3 distinct ways to move - first, last or clicked number.
    const min = Math.floor(rulerLength / 2);

    return arr.map((_, index) => {
      return this.rulerFactory(currentIndex, index, min, maxPages, rulerLength);
    });
  };

  // use rulerOption to define the behavior, the ruler must return.
  // the active page will always be in the center, except at the start and at the end.
  rulerFactory = (
    currentIndex: number,
    index: number,
    min: number,
    maxPages: number,
    rulerLength: number
  ): number => {
    const factory = {
      [RulerFactoryOption.Start]: () => index + 1,
      [RulerFactoryOption.End]: () => maxPages - rulerLength + index + 1,
      [RulerFactoryOption.Default]: () => currentIndex + index - min
    };

    return factory[this.rulerOption(currentIndex, min, maxPages)]();
  };

  // to determine if we are at the beginning, middle or at the end,
  // we use the rulerOption function
  rulerOption = (
    currentIndex: number,
    min: number,
    maxPages: number
  ): RulerFactoryOption => {
    return currentIndex <= min
      ? RulerFactoryOption.Start
      : currentIndex >= maxPages - min
      ? RulerFactoryOption.End
      : RulerFactoryOption.Default;
  };

  allowNavigation = (
    pageNumber: number,
    index: number,
    maxPages: number
  ): boolean => {
    return pageNumber !== index && pageNumber > 0 && pageNumber <= maxPages;
  };

  ngOnInit() {
    this.maxPages = Math.ceil(this.totalCount / this.pageSize);
  }

  get pagination(): NumberedPagination {
    const { index, maxPages, rulerLength } = this;
    const pages = this.ruler(index, maxPages, rulerLength);

    return {
      index,
      maxPages,
      pages
    } as NumberedPagination;
  }

  navigateToPage(pageNumber: number): void {
    // check if requested page is different than current page index
    if (this.allowNavigation(pageNumber, this.index, this.maxPages)) {
      this.index = pageNumber;
      this.page.emit(this.index);
    }
  }

  trackByFn(index: number): number {
    return index;
  }
}
