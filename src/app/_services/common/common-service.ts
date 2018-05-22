import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

declare let swal: any;

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getFilePath(req: any) {
        return this._dataserver.get("getFilePath", req)
    }

    getAutoData(req: any) {
        return this._dataserver.get("getAutoData", req)
    }

    getERPAutoData(req: any) {
        return this._dataserver.get(Globals.erproute + "getAutoData", req)
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

    bulkUpload(req: any) {
        return this._dataserver.post("bulkUpload", req)
    }

    sendEmail(req: any) {
        return this._dataserver.post("sendEmail", req)
    }

    messagebox(title, msg, msgtyp, isconfirm) {
        swal({
            title: title,
            text: msg,
            type: msgtyp,
            showConfirmButton: isconfirm,
            timer: 3000
        })
    }

    // Comapre 2 Arrays

    addNode(prop, value, parent) {
        parent[prop] = value;
    }

    recursiveDiff(a, b, node) {
        var checked = [];

        for (var prop in a) {
            if (typeof b[prop] == 'undefined') {
                this.addNode(prop, '[[removed]]', node);
            }
            else if (JSON.stringify(a[prop]) != JSON.stringify(b[prop])) {
                // if value
                if (typeof b[prop] != 'object' || b[prop] == null) {
                    this.addNode(prop, b[prop], node);
                }
                else {
                    // if array
                    if (this.isArray(b[prop])) {
                        this.addNode(prop, [], node);
                        this.recursiveDiff(a[prop], b[prop], node[prop]);
                    }
                    // if object
                    else {
                        this.addNode(prop, {}, node);
                        this.recursiveDiff(a[prop], b[prop], node[prop]);
                    }
                }
            }
        }
    }

    isArray(obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    }

    getDiff2Arrays(a, b) {
        var diff = (this.isArray(a) ? [] : {});
        this.recursiveDiff(a, b, diff);
        return diff;
    }

    // Audit Log

    saveAuditLog(auditparams) {
        var that = this;

        this._dataserver.post(Globals.erproute + "saveAuditLog", auditparams).subscribe(data => {
            var dataResult = data.data[0].funsave_auditlog;
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }
}