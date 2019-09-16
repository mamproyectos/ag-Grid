import { Component, ElementRef } from '@angular/core';
import { IHeaderParams } from 'ag-grid-community';
import { IHeaderAngularComp } from 'ag-grid-angular/main';

interface MyParams extends IHeaderParams {
    menuIcon: string;
}

@Component({
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})

export class HeaderComponent implements IHeaderAngularComp {
    public params: MyParams;
    public sorted: string;
    private elementRef: ElementRef;

    myHeaderName: string;
    lengthMyHeaderName: number;

    constructor(elementRef: ElementRef) {
        this.elementRef = elementRef;
    }

    agInit(params: MyParams): void {
        this.params = params;
        this.params.column.addEventListener('sortChanged', this.onSortChanged.bind(this));
        this.onSortChanged();

        this.myHeaderName = this.myHeaderNameFunct();
        this.lengthMyHeaderName = this.myHeaderName.length;
        this.myHeaderName = this.myHeaderName.slice(4, this.lengthMyHeaderName - 1);
    }

    ngOnDestroy() {
        console.log(`Destroying HeaderComponent`);
    }

    onMenuClick() {
        this.params.showColumnMenu(this.querySelector('.customHeaderMenuButton'));
    }

    onSortRequested(order, event) {
        this.params.setSort(order, event.shiftKey);
    }

    onSortChanged() {
        if (this.params.column.isSortAscending()) {
            this.sorted = 'asc';
        } else if (this.params.column.isSortDescending()) {
            this.sorted = 'desc';
        } else {
            this.sorted = '';
        }
    }

    private myHeaderNameFunct() {
      return this.params.displayName;
    }

    private querySelector(selector: string) {
        return this.elementRef.nativeElement.querySelector(
            '.customHeaderMenuButton', selector) as HTMLElement;
    }
}
