import { Component } from '@angular/core';
import { IHeaderGroupParams } from 'ag-grid-community/main';
import { IHeaderGroupAngularComp } from 'ag-grid-angular/main';

@Component({
    templateUrl: 'header-group.component.html',
    styleUrls: ['header-group.component.css']
})
export class HeaderGroupComponent implements IHeaderGroupAngularComp {
    public params: IHeaderGroupParams;
    public expanded: boolean;
    private groupNames;
    private gridColumnApi;
    private gridApi;

    agInit(params: IHeaderGroupParams): void {
        this.params = params;
        this.params.columnGroup.getOriginalColumnGroup().addEventListener('expandedChanged', this.onExpandChanged.bind(this));
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;
        // console.log(this.gridColumnApi);
    }


    // onGridReady(params) {
    //   this.gridApi = params.api;
    //   this.gridColumnApi = params.columnApi;
    //   console.log(this.gridColumnApi);
    //  }

    ngOnDestroy() {
        // console.log(`Destroying HeaderComponent`);
    }

    expandOrCollapse() {
       this.params.setExpanded(!this.expanded);
    }

    // expandOrCollapseAll() {
    //   console.log('Expandir o contraer' + this.params.setExpanded);
    //   this.params.setExpanded(!this.params.columnGroup);
    // }

    // expandOrCollapseAll(expand) {
    //   console.log('Expandir o contraer todos');
    //   const columnApi = this.params.columnApi;
    //   // const columnApi = this.params.gridColumnApi;
    //   const groupNames = ['Iniciales,,', 'Modificación,,'];
    //   groupNames.forEach(function(groupId) {
    //     columnApi.setColumnGroupOpened(groupId, expand);
    //   });
    // }

    // https://www.ag-grid.com/javascript-grid-grouping-headers/
    expandOrCollapseAll(expand: boolean) {
      const columnApi = this.gridColumnApi;
      console.log(this.gridColumnApi);
      const groupNames = ['Iniciales,,', 'Modificación,,'];
      console.log(groupNames);
      // groupNames.forEach(function(groupNames[i]) {
      //   columnApi.setColumnOpened(groupNames, expand);
      // });
      columnApi.setColumnOpened(groupNames[1], expand);
    }

    onExpandChanged() {
        this.expanded = this.params.columnGroup.getOriginalColumnGroup().isExpanded();
    }




}
