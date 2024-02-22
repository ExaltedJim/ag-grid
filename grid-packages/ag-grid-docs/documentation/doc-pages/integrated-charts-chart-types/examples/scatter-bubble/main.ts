import {createGrid, FirstDataRenderedEvent, GridApi, GridOptions, GridReadyEvent, ChartRef, ChartType} from '@ag-grid-community/core';
import {getData} from "./data";
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { GridChartsModule } from '@ag-grid-enterprise/charts-enterprise';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ModuleRegistry } from "@ag-grid-community/core";

ModuleRegistry.registerModules([ClientSideRowModelModule, GridChartsModule, MenuModule]);


let gridApi: GridApi;
let chartRef: ChartRef;

const gridOptions: GridOptions = {
  columnDefs: [
    { field: 'division', width: 150, chartDataType: 'category' },
    { field: 'resource', width: 150, chartDataType: 'category' },
    { field: 'revenue', chartDataType: 'series' },
    { field: 'expenses', chartDataType: 'series' },
    { field: 'headcount', chartDataType: 'series' },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
  },
  popupParent: document.body,
  enableRangeSelection: true,
  enableCharts: true,
  chartToolPanelsDef: {
    defaultToolPanel: 'settings'
  },
  onGridReady : (params: GridReadyEvent) => {
    getData().then(rowData => params.api.setGridOption('rowData', rowData));
  },
  onFirstDataRendered,
};

function onFirstDataRendered(params: FirstDataRenderedEvent) {
  chartRef = params.api.createRangeChart({
    chartContainer: document.querySelector('#myChart') as any,
    cellRange: {
      columns: ['resource', 'revenue', 'expenses', 'headcount'],
    },
    chartType: 'scatter',
  })!;
}

function updateChart(chartType: ChartType) {
  gridApi.updateChart({
    type: 'rangeChartUpdate',
    chartId: `${chartRef.chartId}`,
    chartType: chartType
  });
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
  const gridDiv = document.querySelector<HTMLElement>('#myGrid')!
  gridApi = createGrid(gridDiv, gridOptions);
})