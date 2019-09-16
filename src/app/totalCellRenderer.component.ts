import {Component, OnDestroy} from '@angular/core';

import {ICellRendererAngularComp} from 'ag-grid-angular';

@Component({
  selector: 'square-cell',
  template: `<span style="color: green;"> Total {{params.value}} </span>`
})
export class TotalCellRendererComponent implements ICellRendererAngularComp, OnDestroy {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  ngOnDestroy() {
    console.log(`Destroying SquareComponent`);
  }

  refresh(): boolean {
    return false;
  }
}
