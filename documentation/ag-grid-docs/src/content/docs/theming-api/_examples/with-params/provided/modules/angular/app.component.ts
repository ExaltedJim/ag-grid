import { Component } from '@angular/core';

import { AgGridAngular } from 'ag-grid-angular';
import { ClientSideRowModelModule } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const myTheme = themeQuartz.withParams({
    spacing: 12,
    accentColor: 'red',
});

@Component({
    standalone: true,
    imports: [AgGridAngular],
    selector: 'my-app',
    template: `
        <ag-grid-angular
            style="height: 100%;"
            loadThemeGoogleFonts
            [columnDefs]="columnDefs"
            [defaultColDef]="defaultColDef"
            [rowData]="rowData"
            [theme]="theme"
        />
    `,
})
export class AppComponent {
    theme = myTheme;

    columnDefs: ColDef[] = [{ field: 'make' }, { field: 'model' }, { field: 'price' }];

    defaultColDef: ColDef = {
        editable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
    };

    rowData: any[] = (() => {
        const rowData: any[] = [];
        for (let i = 0; i < 10; i++) {
            rowData.push({ make: 'Toyota', model: 'Celica', price: 35000 + i * 1000 });
            rowData.push({ make: 'Ford', model: 'Mondeo', price: 32000 + i * 1000 });
            rowData.push({ make: 'Porsche', model: 'Boxster', price: 72000 + i * 1000 });
        }
        return rowData;
    })();
}
