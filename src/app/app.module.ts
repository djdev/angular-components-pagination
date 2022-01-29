import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { NumberedPaginationModule } from "./shared/components/numbered-pagination/numbered-pagination.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NumberedPaginationModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
