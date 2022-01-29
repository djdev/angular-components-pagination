import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { NumberedPaginationComponent } from "./numbered-pagination.component";

@NgModule({
  imports: [CommonModule],
  declarations: [NumberedPaginationComponent],
  exports: [NumberedPaginationComponent]
})
export class NumberedPaginationModule {}
