import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

const valueCellStyle = {
  'text-align': 'right'
};

const cellStyleRight = {
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

  columnDefs = [
    // {
    //   headerName: '',
    //   field: 'Cod Pro',
    //   width: 57,
    //   cellStyle: cellStyleRight,
    //   hide: true
    // },
    // https://www.ag-grid.com/javascript-grid-provided-renderer-group/
    {
      headerName: '',
      field: 'CodPro',
      width: 57,
      hide: false,
      pinned: 'left'
    },
    {
      headerName: 'Programa',
      field: 'Programa',
      rowGroup: true,
      width: 300,
      resizable: true,
      // hide: true,
      pinned: 'left'
    },
    {
      headerName: 'Capítulo',
      field: 'DesCap',
      rowGroup: true,
      hide: true
    },
    {
      headerName: '',
      field: 'CodEco',
      width: 57,
      cellStyle: cellStyleRight,
      pinned: 'left'
    },
    {
      headerName: 'Económico',
      field: 'DesEco',
      cellClass: 'resaltado',
      width: 300,
      resizable: true,
      pinned: 'left'
    },

    {
      headerName: 'Creditos',
      children: [
        {
          headerName: 'Iniciales',
          field: 'Créditos Iniciales',
          width: 140,
          cellStyle: valueCellStyle,
          // Problema con los decimales con coma en el json.
          cellRenderer: CurrencyCellRenderer
        },
        {
          headerName: 'Iniciales',
          field: 'Créditos Iniciales',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Modificaciones',
          field: 'Modificaciones de Crédito',
          cellStyle: valueCellStyle,
          cellRenderer: CurrencyCellRenderer,
          // type: 'numericColumn',
          width: 140
        },
        {
          headerName: 'Totales',
          field: 'Créditos Totales consignados',
          width: 140,
          cellRenderer: CurrencyCellRenderer
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
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Comprometidos',
          field: 'Saldo de Gastos Compromet.',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Autorizados',
          field: 'Saldo de Gastos Autorizados',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Facturas consumen disp. Pend. Contabilizar',
          field: 'Facturas consumen disp. Pend. Contabilizar',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Fase definitiva',
          field: 'Gastado en Fase Definitiva',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Pendiente Aplicar a Presupuesto',
          field: 'Gasto Pendiente Aplicar a Presupuesto',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Total gastado',
          field: 'Total gastado',
          width: 140,
          cellStyle: valueCellStyle
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
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Realizados',
          field: 'Pagos Realizados',
          width: 140,
          cellStyle: valueCellStyle
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
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Acuerdo no disponibilidad',
          field: 'Saldo de Acuerd. Créd. para No Disponibil.',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Retenidos transferencias',
          field: 'Saldo de Créditos Retenidos para Trans.',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Retenidos pdtes de utilización',
          field: 'Saldo de Créditos Retenidos pdtes de utilización',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Disponible real',
          field: 'Saldo de Crédito Disponible Real',
          width: 140,
          cellStyle: valueCellStyle
        },
        {
          headerName: 'Disponibles vinculación',
          field: 'Saldo de Créditos disp. a nivel de Vinculación',
          width: 140,
          cellStyle: valueCellStyle
        },
      ]
    }

  ];

  // No funciona.
  gridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true
    },
    // columnDefs: columnDefs,
    rowData: null,
    // floatingFilter:true,
    groupHeaderHeight: 75,
    headerHeight: 150,
    floatingFiltersHeight: 50,
    pivotGroupHeaderHeight: 50,
    pivotHeaderHeight: 100,
    showToolPanel: true
  };

  rowData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.rowData = this.http.get('https://mamjerez.fra1.digitaloceanspaces.com/CONSULTA%20EJECUCI%C3%92N%20GASTO+%20(Varias%20conexiones).json');
    // console.log(this.rowData);
  }

  // getSelectedRows() {
  //   const selectedNodes = this.agGrid.api.getSelectedNodes();
  //   const selectedData = selectedNodes.map(node => node.data);
  //   const selectedDataStringPresentation = selectedData.map(node => node.make + ' ' + node.model).join(', ');
  //   alert(`Selected nodes: ${selectedDataStringPresentation}`);
  // }
}

function CurrencyCellRenderer(params: any) {
  const inrFormat = new Intl.NumberFormat('es-ES', {
    // style: 'decimal',
    // currency: 'USD',
    // minimumFractionDigits: 0
  });
  console.log(params.value);
  return inrFormat.format(params.value);
}
