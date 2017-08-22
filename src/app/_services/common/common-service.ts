import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getFilePath(req: any) {
        return this._dataserver.get("getFilePath", req)
    }

    getAutoData(req: any) {
        return this._dataserver.get("getAutoData", req)
    }

    getDropDownData(req: any) {
        return this._dataserver.post("getDropDownData", req)
    }

    getDashboard(req: any) {
        return this._dataserver.post("getDashboard", req)
    }

    getMOM(req: any) {
        return this._dataserver.post("getMOM", req)
    }

    saveMOM(req: any) {
        return this._dataserver.post("saveMOM", req)
    }

    public exportToCSV(data: any, exportFileName: string) {
        var csvData = this.convertToCSV(data);
        var blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, this.createFileName(exportFileName))
        } else {
            var link = document.createElement("a");

            if (link.download !== undefined) {
                var url = URL.createObjectURL(blob);

                link.setAttribute("href", url);
                link.setAttribute("download", this.createFileName(exportFileName));

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    private convertToCSV(objarray: any) {
        var array = typeof objarray != 'object' ? JSON.parse(objarray) : objarray;

        var str = '';
        var row = "";

        for (var index in objarray[0]) {
            row += index + ',';
        }

        row = row.slice(0, -1);
        str += row + '\r\n';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                if (line != '') line += ','
                line += JSON.stringify(array[i][index]);
            }
            str += line + '\r\n';
        }

        return str;
    }

    private createFileName(exportFileName: string): string {
        var date = new Date();
        return (exportFileName + date.toLocaleDateString() + "_" + date.toLocaleTimeString() + '.csv')
    }
}