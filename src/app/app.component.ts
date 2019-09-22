import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

import { GridOptions } from 'ag-grid-community/main';
import { HeaderComponent } from './header-component/header.component';
import { HeaderGroupComponent } from './header-group-component/header-group.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;
  // title = 'app';
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private defaultColDef;
  private gridOptions: GridOptions;
  private localeText;
  private sideBar;
  private rowData: any;
  private defaultSortModel;
  private rowGroupPanelShow;
  private statusBar;
  private paginationPageSize;

  private groupHeaderHeight = 25;
  private headerHeight = 75;
  private HeaderNumericWidth = 92;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {headerName: 'Programa-Capítulo-Económico.',
        children: [
          {
            headerName: 'Programa',
            width: 500,
            pinned: 'left',
            showRowGroup: 'Programa',
            cellRenderer: 'agGroupCellRenderer',
            filter: false,
            cellRendererParams: {
              suppressCount: true,
              footerValueGetter(params) {
                switch (params.node.level) {
                  case 0:  // Total programa.
                    return '<span style="color: red; font-size: 14px; font-weight: bold; margin-left: 0px;"> Total ' + params.value + '</span>';
                  case -1: // Total general.
                    return '<span style="color: red; font-size: 18px; font-weight: bold; margin-right: 0px;"> Total general' + '</span>';
                  default:
                    return 'SIN FORMATO';
                }
              }
            }
          },
          // Si no tengo esta parte separada no funciona bien, repite Programa con cada Económico.
          {
            field: 'Programa',
            rowGroup: true,
            hide: true,
            pinned: 'left'
          },
          {
            headerName: '',
            field: 'Capítulo',
            width: 10,
            hide: true,
            pinned: 'left',
            filter: false
          },
          {
            headerName: 'Capítulo',
            field: 'DesCap',
            width: 300,
            rowGroup: true,
            filter: false,
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
                // console.log('params', params);
                if (params.node.group) {
                  return params.value;
                } else {
                  return '';
                }
              },
              footerValueGetter(params) {
                const val = params.value.split(' - ')[1];
                switch (params.node.level) {
                  case 1:  // Total capítulo.
                    return '<span style="color: red; font-size: 12px;  font-weight: bold; margin-left: 0px;"> Total ' + val + '</span>';
                  case -1: // Total general.
                    return '';
                  default:
                    return 'SIN FORMATO';
                }
              }
            }
          },
          {
            headerName: '',
            field: 'CodEco',
            width: 57,
            pinned: 'left',
            filter: false,
          },
          {
            headerName: 'Económico',
            field: 'DesEco',
            cellClass: 'resaltado',
            width: 400,
            pinned: 'left',
            filter: false,
          },
        ]
      },

      {headerName: 'Créditos',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            // para separar el headerName en 3 lineas debe contener DOS comas.
            headerName: 'Iniciales,,',
            headerComponentFramework: HeaderComponent,
            field: 'Créditos Iniciales',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Modificación,,',
            headerComponentFramework: HeaderComponent,
            field: 'Modificaciones de Crédito',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
            // type: 'numericColumn',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            footerValueGetter(params) {
              const val = params.value;
              return '<span style="color: green; font-size: 12px; font-weight: bold; margin-left: 0px;"> Total ' + val + '</span>';
            }
          },
          {
            headerName: 'Creditos,totales,consignados',
            headerComponentFramework: HeaderComponent,
            field: 'Créditos Totales consignados',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'Closed', // Se muestra por defecto.
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
        ]
      },

      {headerName: 'Gastos',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            headerName: 'Obligaciones,reconocidas,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Obligaciones Reconocidas',
            width: this.HeaderNumericWidth,
            filter: false,
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Comprometidos,,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Gastos Compromet.',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Autorizados,,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Gastos Autorizados',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Facturas, consumen disp., Pend. Contabilizar',
            headerComponentFramework: HeaderComponent,
            field: 'Facturas consumen disp. Pend. Contabilizar',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Fase,definitiva,',
            headerComponentFramework: HeaderComponent,
            field: 'Gastado en Fase Definitiva',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Pendiente,Aplicar,a Presupuesto',
            headerComponentFramework: HeaderComponent,
            field: 'Gasto Pendiente Aplicar a Presupuesto',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Total,gastado,',
            headerComponentFramework: HeaderComponent,
            field: 'Total gastado',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
        ]
      },

      {headerName: 'Pagos',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            headerName: 'Ordenados,,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Pagos Ordenados',
            width: this.HeaderNumericWidth,
            filter: false,
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Realizados,,',
            headerComponentFramework: HeaderComponent,
            field: 'Pagos Realizados',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
        ]
      },

      {headerName: 'Saldos créditos',
        headerGroupComponentFramework: HeaderGroupComponent,
        children: [
          {
            headerName: 'Disponibles,,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Créditos disponibles',
            width: this.HeaderNumericWidth + 30, // + espacio para la fecha de despliegue.
            filter: false,
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Acuerdo no,disponibilidad,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Acuerd. Créd. para No Disponibil.',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Retenidos,transferencias,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Créditos Retenidos para Trans.',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Retenidos,pendientes,de utilización',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Créditos Retenidos pdtes de utilización',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Disponible,real,',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Crédito Disponible Real',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
          {
            headerName: 'Disponibles,a nivel,vinculación',
            headerComponentFramework: HeaderComponent,
            field: 'Saldo de Créditos disp. a nivel de Vinculación',
            width: this.HeaderNumericWidth,
            filter: false,
            columnGroupShow: 'open',
            aggFunc: 'sum',
            cellRenderer: CellRendererOCM
            ,
          },
        ]
      }
    ];

    this.defaultColDef = {
      sortable: true,
      resizable: true,
      filter: true
    };

    this.sideBar = {
      toolPanels: ['filters', 'columns']
    };

    // this.rowGroupPanelShow = 'always';
    // this.statusBar = {
    //   statusPanels: [
    //     {
    //       statusPanel: 'agTotalAndFilteredRowCountComponent',
    //       align: 'left'
    //     },
    //     { statusPanel: 'agAggregationComponent' }
    //   ]
    // };
    // this.paginationPageSize = 500;

    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = {} as GridOptions;
    this.gridOptions.defaultColDef = {
      headerComponentFramework: HeaderComponent as new () => HeaderComponent,
      headerComponentParams: {
        menuIcon: 'fa-bars'
      }
    };

    this.defaultSortModel = [
      {
        colId: 'CodEco',
        sort: 'asc'
      }
    ];

    this.localeText = {
      // for filter panel
      page: 'Page',
      more: 'More',
      to: 'To',
      of: 'Of',
      next: 'Next',
      last: 'Last',
      first: 'First',
      previous: 'Previous',
      loadingOoo: 'Cargando...',

      // for set filter
      selectAll: 'Seleccionar todos',
      searchOoo: 'Buscar...',
      blanks: 'Blanco',

      // for number filter and text filter
      filterOoo: 'Filtrar...',
      applyFilter: 'ApplyFilter...',
      equals: 'Equals',
      notEquals: 'NotEqual',

      // for number filter
      lessThan: 'LessThan',
      greaterThan: 'GreaterThan',
      lessThanOrEqual: 'LessThanOrEqual',
      greaterThanOrEqual: 'GreaterThanOrEqual',
      inRange: 'InRange',

      // for text filter
      contains: 'Contains',
      notContains: 'NotContains',
      startsWith: 'Starts with',
      endsWith: 'Ends with',

      // filter conditions
      andCondition: 'AND',
      orCondition: 'OR',

      // the header of the default group column
      group: 'Group',

      // tool panel
      columns: 'Columnas',
      filters: 'Programas',
      rowGroupColumns: 'Pivot Cols',
      rowGroupColumnsEmptyMessage: 'drag cols to group',
      valueColumns: 'Value Cols',
      pivotMode: 'Pivot-Mode',
      groups: 'Groups',
      values: 'Values',
      pivots: 'Pivots',
      valueColumnsEmptyMessage: 'drag cols to aggregate',
      pivotColumnsEmptyMessage: 'drag here to pivot',
      toolPanelButton: 'tool panel',

      // other
      noRowsToShow: 'no rows',

      // enterprise menu
      pinColumn: 'Pin Column',
      valueAggregation: 'laValue Agg',
      autosizeThiscolumn: 'Autosize Diz',
      autosizeAllColumns: 'Auto tamaño todos',
      groupBy: 'Group by',
      ungroupBy: 'UnGroup by',
      resetColumns: 'Reset Those Cols',
      expandAll: 'Expandir todo',
      collapseAll: 'Colapsar todo',
      toolPanel: 'Tool Panel',
      export: 'Exportar',
      csvExport: 'CSV Export',
      excelExport: 'Excel Export (.xlsx)',
      excelXmlExport: 'Excel Export (.xml)',

      // enterprise menu (charts)
      pivotChartAndPivotMode: 'laPivot Chart & Pivot Mode',
      pivotChart: 'Pivot Chart',
      chartRange: 'Chart Range',

      columnChart: 'Column',
      groupedColumn: 'Grouped',
      stackedColumn: 'Stacked',
      normalizedColumn: '100% Stacked',

      barChart: 'Bar',
      groupedBar: 'Grouped',
      stackedBar: 'Stacked',
      normalizedBar: '100% Stacked',

      pieChart: 'Pie',
      pie: 'Pie',
      doughnut: 'Doughnut',

      line: 'Line',

      xyChart: 'X Y (Scatter)',
      scatter: 'Scatter',
      bubble: 'Bubble',

      areaChart: 'Area',
      area: 'Area',
      stackedArea: 'Stacked',
      normalizedArea: '100% Stacked',

      // enterprise menu pinning
      pinLeft: 'Pin <<',
      pinRight: 'Pin >>',
      noPin: 'DontPin <>',

      // enterprise menu aggregation and status bar
      sum: 'sum',
      min: 'min',
      max: 'max',
      none: 'none',
      count: 'count',
      average: 'average',
      filteredRows: 'Filtered',
      selectedRows: 'Selected',
      totalRows: 'Total Rows',
      totalAndFilteredRows: 'Rows',

      // standard menu
      copy: 'Copy',
      copyWithHeaders: 'Copy Wit hHeaders',
      ctrlC: 'ctrl n C',
      paste: 'Paste',
      ctrlV: 'ctrl n V',

      // charts
      pivotChartTitle: 'Pivot Chart',
      rangeChartTitle: 'Range Chart',
      settings: 'Settings',
      data: 'Data',
      format: 'Format',
      categories: 'Categories',
      series: 'Series',
      axis: 'Axis',
      color: 'Color',
      thickness: 'Thickness',
      xRotation: 'X Rotation',
      yRotation: 'Y Rotation',
      ticks: 'Ticks',
      width: 'Width',
      length: 'Length',
      padding: 'Padding',
      chart: 'Chart',
      title: 'Title',
      font: 'Font',
      top: 'Top',
      right: 'Right',
      bottom: 'Bottom',
      left: 'Left',
      labels: 'Labels',
      size: 'Size',
      legend: 'Legend',
      position: 'Position',
      markerSize: 'Marker Size',
      markerStroke: 'Marker Stroke',
      markerPadding: 'Marker Padding',
      itemPaddingX: 'Item Padding X',
      itemPaddingY: 'Item Padding Y',
      strokeWidth: 'Stroke Width',
      offset: 'Offset',
      tooltips: 'Tooltips',
      offsets: 'Offsets',
      callout: 'Callout',
      markers: 'Markers',
      shadow: 'Shadow',
      blur: 'Blur',
      xOffset: 'X Offset',
      yOffset: 'Y Offset',
      lineWidth: 'Line Width',
      normal: 'Normal',
      bold: 'Bold',
      italic: 'Italic',
      boldItalic: 'Bold Italic',
      fillOpacity: 'Fill Opacity',
      strokeOpacity: 'Line Opacity',
      columnGroup: 'Column',
      barGroup: 'Bar',
      pieGroup: 'Pie',
      lineGroup: 'Line',
      scatterGroup: 'Scatter',
      areaGroup: 'Area',
      groupedColumnTooltip: 'Grouped',
      stackedColumnTooltip: 'Stacked',
      normalizedColumnTooltip: '100% Stacked',
      groupedBarTooltip: 'Grouped',
      stackedBarTooltip: 'Stacked',
      normalizedBarTooltip: '100% Stacked',
      pieTooltip: 'Pie',
      doughnutTooltip: 'Doughnut',
      lineTooltip: 'Line',
      groupedAreaTooltip: 'Grouped',
      stackedAreaTooltip: 'Stacked',
      normalizedAreaTooltip: '100% Stacked',
      scatterTooltip: 'Scatter',
      bubbleTooltip: 'Bubble',
      noDataToChart: 'No data available to be charted.',
      pivotChartRequiresPivotMode: 'Pivot Chart requires Pivot Mode enabled.'
    };
  }

  ngOnInit() { }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/20190807eje.json');
    params.api.setSortModel(this.defaultSortModel);
  }
}

function CellRendererOCM(params: any) {
  if (params.value) {
    const valorFormateado = params.value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    if (params.node.footer) {
      switch (params.node.level) {
        case 1: // Total capítulo.
          return '<p style="text-align: right; color: red; font-size: 12px; font-weight: bold">' + valorFormateado + '</p>';
        case 0:  // Total programa.
          return '<p style="text-align: right; color: red; font-size: 13px; font-weight: bold">' + valorFormateado + '</p>';
        case -1: // Total general.
          return '<p style="text-align: right; color: red; font-size: 14px; font-weight: bold">' + valorFormateado + '</p>';
        default:
          return 'SIN FORMATO';
      }
    } else {
      return '<p style="text-align: right">' + valorFormateado + '</p>';
    }
  } else {
    return '';
  }
}


// {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },

 //  TODO: NO parece hacer nada.
  // autoGroupColumnDef = {
  //   headerName: 'Programa',
  //   field: 'Programa',
  //   cellRenderer: 'agGroupCellRenderer',
  //   cellRendererParams: {
  //     checkbox: true
  //   }
  // };

// function CurrencyCellRenderer(params: any) {
//   const inrFormat = new Intl.NumberFormat('es-ES', {
//     style: 'decimal',
//     currency: 'EUR',
//     minimumFractionDigits: 0
//   });
//   console.log(inrFormat.format(params.value));
//   return inrFormat.format(params.value);
// }
