import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import {TotalCellRendererComponent} from './totalCellRenderer.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TotalCellRendererComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AgGridModule.withComponents([TotalCellRendererComponent])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
