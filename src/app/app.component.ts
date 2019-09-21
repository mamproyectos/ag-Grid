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
  private HeaderNumericWidth = 98;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      {
        headerName: 'Programa-Capítulo-Económico.',
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

      {
        headerName: 'Creditos',
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

      {
        headerName: 'Gastos',
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

      {
        headerName: 'Pagos',
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

      {
        headerName: 'Saldos créditos',
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
      page: 'daPage',
      more: 'daMore',
      to: 'daTo',
      of: 'daOf',
      next: 'daNexten',
      last: 'daLasten',
      first: 'daFirsten',
      previous: 'daPreviousen',
      loadingOoo: 'daLoading...',

      // for set filter
      selectAll: 'Seleccionar todos',
      searchOoo: 'Buscar...',
      blanks: 'daBlanc',

      // for number filter and text filter
      filterOoo: 'Filtrar...',
      applyFilter: 'daApplyFilter...',
      equals: 'daEquals',
      notEquals: 'daNotEqual',

      // for number filter
      lessThan: 'daLessThan',
      greaterThan: 'daGreaterThan',
      lessThanOrEqual: 'daLessThanOrEqual',
      greaterThanOrEqual: 'daGreaterThanOrEqual',
      inRange: 'daInRange',

      // for text filter
      contains: 'daContains',
      notContains: 'daNotContains',
      startsWith: 'daStarts dawith',
      endsWith: 'daEnds dawith',

      // filter conditions
      andCondition: 'daAND',
      orCondition: 'daOR',

      // the header of the default group column
      group: 'laGroup',

      // tool panel
      columns: 'Columnas',
      filters: 'Programas',
      rowGroupColumns: 'laPivot Cols',
      rowGroupColumnsEmptyMessage: 'la drag cols to group',
      valueColumns: 'laValue Cols',
      pivotMode: 'Pivot-Mode',
      groups: 'laGroups',
      values: 'laValues',
      pivots: 'laPivots',
      valueColumnsEmptyMessage: 'la drag cols to aggregate',
      pivotColumnsEmptyMessage: 'la drag here to pivot',
      toolPanelButton: 'la tool panel',

      // other
      noRowsToShow: 'la no rows',

      // enterprise menu
      pinColumn: 'laPin Column',
      valueAggregation: 'laValue Agg',
      autosizeThiscolumn: 'laAutosize Diz',
      autosizeAllColumns: 'laAutsoie em All',
      groupBy: 'laGroup by',
      ungroupBy: 'laUnGroup by',
      resetColumns: 'laReset Those Cols',
      expandAll: 'laOpen-em-up',
      collapseAll: 'laClose-em-up',
      toolPanel: 'laTool Panelo',
      export: 'laExporto',
      csvExport: 'laCSV Exportp',
      excelExport: 'laExcel Exporto (.xlsx)',
      excelXmlExport: 'laExcel Exporto (.xml)',

      // enterprise menu (charts)
      pivotChartAndPivotMode: 'laPivot Chart & Pivot Mode',
      pivotChart: 'laPivot Chart',
      chartRange: 'laChart Range',

      columnChart: 'laColumn',
      groupedColumn: 'laGrouped',
      stackedColumn: 'laStacked',
      normalizedColumn: 'la100% Stacked',

      barChart: 'laBar',
      groupedBar: 'laGrouped',
      stackedBar: 'laStacked',
      normalizedBar: 'la100% Stacked',

      pieChart: 'laPie',
      pie: 'laPie',
      doughnut: 'laDoughnut',

      line: 'laLine',

      xyChart: 'laX Y (Scatter)',
      scatter: 'laScatter',
      bubble: 'laBubble',

      areaChart: 'laArea',
      area: 'laArea',
      stackedArea: 'laStacked',
      normalizedArea: 'la100% Stacked',

      // enterprise menu pinning
      pinLeft: 'laPin <<',
      pinRight: 'laPin >>',
      noPin: 'laDontPin <>',

      // enterprise menu aggregation and status bar
      sum: 'laSum',
      min: 'laMin',
      max: 'laMax',
      none: 'laNone',
      count: 'laCount',
      average: 'laAverage',
      filteredRows: 'laFiltered',
      selectedRows: 'laSelected',
      totalRows: 'laTotal Rows',
      totalAndFilteredRows: 'laRows',

      // standard menu
      copy: 'laCopy',
      copyWithHeaders: 'laCopy Wit hHeaders',
      ctrlC: 'ctrl n C',
      paste: 'laPaste',
      ctrlV: 'ctrl n V',

      // charts
      pivotChartTitle: 'laPivot Chart',
      rangeChartTitle: 'laRange Chart',
      settings: 'laSettings',
      data: 'laData',
      format: 'laFormat',
      categories: 'laCategories',
      series: 'laSeries',
      axis: 'laAxis',
      color: 'laColor',
      thickness: 'laThickness',
      xRotation: 'laX Rotation',
      yRotation: 'laY Rotation',
      ticks: 'laTicks',
      width: 'laWidth',
      length: 'laLength',
      padding: 'laPadding',
      chart: 'laChart',
      title: 'laTitle',
      font: 'laFont',
      top: 'laTop',
      right: 'laRight',
      bottom: 'laBottom',
      left: 'laLeft',
      labels: 'laLabels',
      size: 'laSize',
      legend: 'laLegend',
      position: 'laPosition',
      markerSize: 'laMarker Size',
      markerStroke: 'laMarker Stroke',
      markerPadding: 'laMarker Padding',
      itemPaddingX: 'laItem Padding X',
      itemPaddingY: 'laItem Padding Y',
      strokeWidth: 'laStroke Width',
      offset: 'laOffset',
      tooltips: 'laTooltips',
      offsets: 'laOffsets',
      callout: 'laCallout',
      markers: 'laMarkers',
      shadow: 'laShadow',
      blur: 'laBlur',
      xOffset: 'laX Offset',
      yOffset: 'laY Offset',
      lineWidth: 'laLine Width',
      normal: 'laNormal',
      bold: 'laBold',
      italic: 'laItalic',
      boldItalic: 'laBold Italic',
      fillOpacity: 'laFill Opacity',
      strokeOpacity: 'laLine Opacity',
      columnGroup: 'Column',
      barGroup: 'Bar',
      pieGroup: 'Pie',
      lineGroup: 'Line',
      scatterGroup: 'Scatter',
      areaGroup: 'Area',
      groupedColumnTooltip: 'laGrouped',
      stackedColumnTooltip: 'laStacked',
      normalizedColumnTooltip: 'la100% Stacked',
      groupedBarTooltip: 'laGrouped',
      stackedBarTooltip: 'laStacked',
      normalizedBarTooltip: 'la100% Stacked',
      pieTooltip: 'laPie',
      doughnutTooltip: 'laDoughnut',
      lineTooltip: 'laLine',
      groupedAreaTooltip: 'laGrouped',
      stackedAreaTooltip: 'laStacked',
      normalizedAreaTooltip: 'la100% Stacked',
      scatterTooltip: 'laScatter',
      bubbleTooltip: 'laBubble',
      noDataToChart: 'laNo data available to be charted.',
      pivotChartRequiresPivotMode: 'laPivot Chart requires Pivot Mode enabled.'
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
