'use strict';

import React, { useCallback, useMemo, useState, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AgGridReact } from '@ag-grid-community/react';
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-quartz.css';
import MenuItem from './menuItem.jsx';
import { ModuleRegistry } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';
import { RangeSelectionModule } from '@ag-grid-enterprise/range-selection';
import { ClipboardModule } from '@ag-grid-enterprise/clipboard';


ModuleRegistry.registerModules([ClientSideRowModelModule, MenuModule, ExcelExportModule, RangeSelectionModule, ClipboardModule]);

const GridExample = () => {    
    const containerStyle = useMemo(() => ({ width: '100%', height: '100%' }), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        { field: 'athlete'},
        { field: 'country' },
        { field: 'sport' },
        { field: 'year'},
        { field: 'gold' },
        { field: 'silver' },
        { field: 'bronze' },
    ]);
    const defaultColDef = useMemo(() => { return {
        flex: 1,
        minWidth: 100,
    } }, []);

    const onGridReady = useCallback((params) => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then((data) => {
                setRowData( data);
            });
    }, []);

    const getMainMenuItems = useCallback((params) => {
        return [
            ...params.defaultItems,
            'separator',
            {
                name: 'Click Alert Button and Close Menu',
                menuItem: MenuItem,
                menuItemParams: {
                    buttonValue: 'Alert'
                }
            },
            {
                name: 'Click Alert Button and Keep Menu Open',
                suppressCloseOnSelect: true,
                menuItem: MenuItem,
                menuItemParams: {
                    buttonValue: 'Alert'
                }
            }
        ];
    }, []);

    const getContextMenuItems = useCallback((params) => {
        return [
            ...(params.defaultItems || []),
            'separator',
            {
                name: 'Click Alert Button and Close Menu',
                menuItem: MenuItem,
                menuItemParams: {
                    buttonValue: 'Alert'
                }
            },
            {
                name: 'Click Alert Button and Keep Menu Open',
                suppressCloseOnSelect: true,
                menuItem: MenuItem,
                menuItemParams: {
                    buttonValue: 'Alert'
                }
            }
        ]
    }, []);

    return  (
        <div style={containerStyle}>
            <div  style={gridStyle} className={/** DARK MODE START **/document.documentElement.dataset.defaultTheme || 'ag-theme-quartz'/** DARK MODE END **/}>
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getMainMenuItems={getMainMenuItems}
                    getContextMenuItems={getContextMenuItems}
                    suppressMenuHide
                    reactiveCustomComponents
                    onGridReady={onGridReady}
                />
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById('root'));
root.render(<StrictMode><GridExample /></StrictMode>);
