// import { DatagridComponent } from "src/app/shared/components/datagrid/datagrid.component";
// import { UtilsService } from "../../services/utils.service";

// export interface DgMetaData {
//     firstItemOnPage: number;
//     hasNextPage: boolean;
//     hasPreviousPage: boolean;
//     isFirstPage: boolean;
//     isLastPage: boolean;
//     lastItemOnPage: number;
//     pageCount: number;
//     pageNumber: number;
//     pageSize: number;
//     totalItemCount: number;
// }

// interface Options {
//     key?: string | Array<string>,
//     errorHandler?: (e: Error) => void,

//     loadUrl?: string,
//     loadParams?: Object,
//     loadMethod?: string,

//     updateUrl?: string,
//     updateMethod?: string,

//     insertUrl?: string,
//     insertMethod?: string,

//     deleteUrl?: string,
//     deleteMethod?: string,

//     loadMode?: "processed" | "raw",
//     cacheRawData?: boolean,

//     onBeforeSend?: (operation: string, ajaxSettings: {
//         cache?: boolean;
//         contentType?: any;
//         data?: any;
//         dataType?: string;
//         headers?: { [key: string]: any; };
//         method?: string;
//         password?: string;
//         timeout?: number;
//         url?: string;
//         username?: string;
//         xhrFields?: { [key: string]: any; };
//     }) => void,
//     onAjaxError?: (e: { xhr: XMLHttpRequest, error: string | Error }) => void

//     onLoading?: (loadOptions: any) => void;
//     onLoaded?: (result: Array<any>) => void;

//     onInserting?: (values: any) => void;
//     onInserted?: (values: any, key: any) => void;

//     onUpdating?: (key: any, values: any) => void;
//     onUpdated?: (key: any, values: any) => void;

//     onRemoving?: (key: any) => void;
//     onRemoved?: (key: any) => void;

//     onModifying?: Function;
//     onModified?: Function;

//     onPush?: (changes: Array<any>) => void;
// }

export interface IAjaxSettings {
    params?: any, data?: any
}

// export interface IDgOptions {
//     onBeforeSend?: (operation: string, ajaxSettings: IAjaxSettings) => void;
//     onLoaded?: () => void;
//     onLoading?: (result: any) => void;
//     onPagination?: (result: any) => void;
//     loadUrl?: string;
//     loadFormatArgs?: any[];
// }

// export class DgTemplate {
//     dataGrid?: DatagridComponent;
//     options?: IDgOptions;
//     utilService?: UtilsService;
//     constructor(options?: IDgOptions) {
//         this.options = options;
//         if (options) {
//             this.options.loadFormatArgs = this.options.loadFormatArgs || [];
//         }
//     }

//     load() {
//         if (this.options.loadUrl) {
//             let ajaxSettings = { data: {}, params: {} };
//             this.options.onBeforeSend && this.options.onBeforeSend('load', ajaxSettings);

//             this.utilService.getRequest(this.options.loadUrl, ajaxSettings.params, ...this.options.loadFormatArgs).subscribe((result) => {
//                 if (this.options.onLoading) {
//                     this.options.onLoading(result);
//                 }
//                 else {
//                     this.dataGrid.dataGridSource = result;
//                 }
//                 this.options.onLoaded && this.options.onLoaded();
//             })
//         }
//         else {
//             this.options.onLoaded && this.options.onLoaded();
//         }

//     }

//     loadDataGridSource(dataGridSource) {
//         this.dataGrid.dataGridSource = dataGridSource;
//         this.dataGrid.loadDataRows();
//     }

// }
