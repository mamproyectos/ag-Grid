import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import 'ag-grid-enterprise';

import { AppComponent } from './app.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';
import { FooterComponent } from './footer/footer.component';
import { TotalCellRendererComponent } from './totalCellRenderer.component';
import { CustomHeaderComponent } from './custom-header/custom-header.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    TotalCellRendererComponent,
    CustomHeaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AgGridModule.withComponents([TotalCellRendererComponent])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
