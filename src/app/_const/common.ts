import { Globals } from '@globals';

declare let $: any;

export class Common {
    static getReportUrl(url: String, params: any) {
        return Globals.reporturl + url + "?" + $.param(params)
    }
}