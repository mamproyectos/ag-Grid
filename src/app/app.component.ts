import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

import { GridOptions } from 'ag-grid-community/main';
import { HeaderComponent } from './header-component/header.component';

const valueCellStyle = {
  'text-align': 'right'
};
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  title = 'app';

  private gridOptions: GridOptions;

  public sideBar;
  rowData: any;
  groupHeaderHeight = 25;
  headerHeight = 25;

  private gridApi;
  private gridColumnApi;

  columnDefs = [
    // {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },
    // https://www.ag-grid.com/javascript-grid-provided-renderer-group/
    //
    {
      headerName: 'Programa',
      width: 500,
      pinned: 'left',
      resizable: true,
      showRowGroup: 'Programa',
      cellRenderer: 'agGroupCellRenderer',
      // filter: 'agTextColumnFilter',
      filter: false,
      filterValueGetter: params => params.data.Programa,
      cellRendererParams: {
        suppressCount: true,
        footerValueGetter(params) {
          return '<span style="color: red; font-size: 14px; padding-right: 5px;"> Total ' + params.value + '</span>';
        }
      }
    },
    {
      field: 'Programa',
      rowGroup: true,
      hide: true,
      pinned: 'left',
      resizable: true,
      filter: true,
      // showRowGroup: 'Programa',
      // cellRenderer: 'agGroupCellRenderer',
      // filter: 'agTextColumnFilter',
      // filterValueGetter: params => params.data.Programa
    },
    // {
    //     headerName: '',
    //     field: 'CodPro',
    //     width: 57,
    //     hide: false,
    //     pinned: 'left'
    //   },
    {
      headerName: '',
      field: 'Capítulo',
      width: 10,
      hide: true,
      pinned: 'left',
      resizable: true,
      filter: false,
      sortable: true,

      // cellStyle: cellStyleRight,
      // rowGroup: true,
      // cellRenderer: 'agGroupCellRenderer',
      // showRowGroup: 'Programa',

    },
    {
      headerName: 'Capítulo',
      field: 'DesCap',
      width: 300,
      rowGroup: true,
      resizable: true,
      filter: false,
      // hide: true,
      pinned: 'left',
      showRowGroup: 'DesCap',
      cellRenderer: 'agGroupCellRenderer',
      valueGetter: params => {
        if (params.data) {
          return params.data.Capítulo + ' - ' + params.data.DesCap;
        } else {
          return null;
        }
      },
      cellRendererParams: {
        suppressCount: true,
        innerRenderer: params => {
          console.log('params', params);
          if (params.node.group) {
            return params.value;
          } else {
            return '';
          }
        },
        footerValueGetter(params) {
          const val = params.value.split(' - ')[1];
          return '<span style="color: red; font-size: 14px; padding-right: 5px;"> Total ' + val + '</span>';
        }
      }
    },
    {
      headerName: '',
      field: 'CodEco',
      width: 57,
      // cellStyle: cellStyleRight,
      pinned: 'left',
      filter: false,
      // comparator(valueA, valueB, nodeA, nodeB, isInverted) {
      //   return valueA - valueB;
      // }
    },
    {
      headerName: 'Económico',
      field: 'DesEco',
      cellClass: 'resaltado',
      width: 400,
      resizable: true,
      pinned: 'left',
      filter: false,
    },

    {
      headerName: 'Creditos',
      children: [
        {
          headerName: 'Iniciales',
          field: 'Créditos Iniciales',
          width: 100,
          resizable: true,
          filter: false,
          cellStyle: valueCellStyle,
          aggFunc: 'sum',
          // suppressSizeToFit: true,
          // cellRenderer: 'agGroupCellRenderer',
          // cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          // cellRendererParams: {
          //   suppressCount: true, // turn off the row count
          //   suppressDoubleClickExpand: true, // turn off double click for expand
          //   innerRenderer: params => params.value, // provide an inner renderer
          //   footerValueGetter: function (params) {
          //     console.log('test loolo00000 params', params);
          //     return '<span style="color: red; font-size: 14px; padding-right: 5px;">' + params.value + '</span>';
          //   }
          // }
        },
        {
          headerName: 'Modificaciones',
          field: 'Modificaciones de Crédito',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          // type: 'numericColumn',
          width: 140,
          filter: false,
        },
        {
          headerName: 'Totales',
          field: 'Créditos Totales consignados',
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
          width: 140,
          filter: false,
        },
      ]
    },

    {
      headerName: 'Gastos',
      children: [
        {
          headerName: 'Obliga. reconocidas',
          field: 'Saldo de Obligaciones Reconocidas',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Comprometidos',
          field: 'Saldo de Gastos Compromet.',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Autorizados',
          field: 'Saldo de Gastos Autorizados',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Facturas consumen disp. Pend. Contabilizar',
          field: 'Facturas consumen disp. Pend. Contabilizar',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Fase definitiva',
          field: 'Gastado en Fase Definitiva',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Pendiente Aplicar a Presupuesto',
          field: 'Gasto Pendiente Aplicar a Presupuesto',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Total gastado',
          field: 'Total gastado',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    },

    {
      headerName: 'Pagos',
      children: [
        {
          headerName: 'Ordenados',
          field: 'Saldo de Pagos Ordenados',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Realizados',
          field: 'Pagos Realizados',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    },

    {
      headerName: 'Saldos de créditos',
      children: [
        {
          headerName: 'Disponibles',
          field: 'Saldo de Créditos disponibles',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Acuerdo no disponibilidad',
          field: 'Saldo de Acuerd. Créd. para No Disponibil.',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Retenidos transferencias',
          field: 'Saldo de Créditos Retenidos para Trans.',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Retenidos pdtes de utilización',
          field: 'Saldo de Créditos Retenidos pdtes de utilización',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Disponible real',
          field: 'Saldo de Crédito Disponible Real',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
        {
          headerName: 'Disponibles vinculación',
          field: 'Saldo de Créditos disp. a nivel de Vinculación',
          width: 140,
          filter: false,
          aggFunc: 'sum',
          cellStyle: valueCellStyle,
          cellRenderer: redCellRenderer,
          valueFormatter: CurrencyCellRenderer,
        },
      ]
    }

  ];

  //  TODO: NO parece hacer nada.
  autoGroupColumnDef = {
    headerName: 'Programa',
    field: 'Programa',
    cellRenderer: 'agGroupCellRenderer',
    cellRendererParams: {
        checkbox: true
    }
};

  constructor(private http: HttpClient) {
    this.sideBar = 'filters';
     // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = {} as GridOptions;
    this.gridOptions.defaultColDef = {
        headerComponentFramework : HeaderComponent as new() => HeaderComponent,
        headerComponentParams : {
            menuIcon: 'fa-bars'
        }
  };
}

  ngOnInit() {}

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/20190807eje.json');
    const defaultSortModel = [
      {
        colId: 'CodEco',
        sort: 'asc'
      }
    ];
    params.api.setSortModel(defaultSortModel);
  }
}

function CurrencyCellRenderer(params: any) {
  if (params.value) {
    return params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  } else {
    return null;
  }
}

function redCellRenderer(params: any) {
  if (params.node.footer) {
    return '<span style="color: red; font-size: 14px; padding-right: 5px;">' + params.valueFormatted + '</span>';
  } else {
    return params.valueFormatted;
  }
}

 // No funciona. ................................
  // gridOptions = {
  //   defaultColDef: {
  //     sortable: true,
  //     resizable: true
  //   },
  //    };

  // defaultColDef = {
  //   width: 150,
  //   editable: true,
  //   filter: false,
  // };
  // Final No funciona. ................................

// function CurrencyCellRenderer(params: any) {
//   const inrFormat = new Intl.NumberFormat('es-ES', {
//     style: 'decimal',
//     currency: 'EUR',
//     minimumFractionDigits: 0
//   });
//   console.log(inrFormat.format(params.value));
//   return inrFormat.format(params.value);
// }
