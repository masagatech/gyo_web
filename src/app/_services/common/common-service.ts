import { Injectable } from '@angular/core';
import { DataService } from '../dataconnect';
import { Globals } from '@globals';
import { Router } from '@angular/router';

import swal from 'sweetalert2'

@Injectable()
export class CommonService {
    constructor(private _dataserver: DataService, private _router: Router) {
        
    }

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

    getMOM(req: any) {
        return this._dataserver.post("getMOM", req)
    }

    getMenuDetails(req: any) {
        return this._dataserver.post("getMenuDetails", req)
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

    showmsgbox(title, msg, msgtyp) {
        swal({
            title: title,
            text: msg,
            type: msgtyp,
            timer: 3000
        })
    }

    confirmmsgbox(msg, confmsg, cancelmsg, callback) {
        swal({
            title: "Are you sure?",
            text: confmsg,
            type: "warning",
            showConfirmButton: true,
            confirmButtonText: "Ok",
            showCancelButton: true,
            cancelButtonText: "Cancel",
            timer: 3000
        }).then((result) => {
            if (result.value) {
                swal('Confirm!', msg, "success");
                callback(true);
            } else if (result.dismiss === swal.DismissReason.cancel) {
                swal('Cancelled', cancelmsg, "error");
                return;
            }
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

    // numToWords :: (Number a, String a) => a -> String

    numToWords(number) {
        // Validates the number input and makes it a string

        if (typeof number === 'string') {
            number = parseInt(number, 10);
        }
        if (typeof number === 'number' && !isNaN(number) && isFinite(number)) {
            number = number.toString(10);
        }
        else {
            return 'This is not a valid number';
        }

        // Creates an array with the number'S digits and
        // adds the necessary amount of 0 to make it fully 
        // divisible by 3

        var digits = number.split('');
        var digitsNeeded = 3 - digits.length % 3;

        if (digitsNeeded !== 3) { //prevents this : (123) ---> (000123) 
            while (digitsNeeded > 0) {
                digits.unshift('0');
                digitsNeeded--;
            }
        }

        // Groups the digits in groups of three

        var digitsGroup = [];
        var numberOfGroups = digits.length / 3;

        for (var i = 0; i < numberOfGroups; i++) {
            digitsGroup[i] = digits.splice(0, 3);
        }

        // Change the group's numerical values to text

        var digitsGroupLen = digitsGroup.length;

        var numTxt = [
            [null, 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'], //hundreds
            [null, 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'], //tens
            [null, 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'] //ones
        ];

        var tenthsDifferent = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']

        // j maps the groups in the digitsGroup
        // k maps the element'S position in the group to the numTxt equivalent
        // k values: 0 = hundreds, 1 = tens, 2 = ones

        for (var j = 0; j < digitsGroupLen; j++) {
            for (var k = 0; k < 3; k++) {
                var currentValue = digitsGroup[j][k];
                digitsGroup[j][k] = numTxt[k][currentValue];

                if (k === 0 && currentValue !== '0') { // !==0 avoids creating a string "null hundred"
                    digitsGroup[j][k] += ' hundred ';
                }
                else if (k === 1 && currentValue === '1') { //Changes the value in the tens place and erases the value in the ones place
                    digitsGroup[j][k] = tenthsDifferent[digitsGroup[j][2]];
                    digitsGroup[j][2] = 0; //Sets to null. Because it sets the next k to be evaluated, setting this to null doesn'T work.
                }
            }
        }

        // Adds '-' for grammar, cleans all null values, joins the group'S elements into a string

        for (var l = 0; l < digitsGroupLen; l++) {
            if (digitsGroup[l][1] && digitsGroup[l][2]) {
                digitsGroup[l][1] += '-';
            }

            digitsGroup[l].filter(function (e) { return e !== null });
            digitsGroup[l] = digitsGroup[l].join('');
        }

        // Adds thousand, millions, billion and etc to the respective string.

        var posfix = [null, 'Thousand', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion'];

        if (digitsGroupLen > 1) {
            var posfixRange = posfix.splice(0, digitsGroupLen).reverse();

            for (var m = 0; m < digitsGroupLen - 1; m++) { //'-1' prevents adding a null posfix to the last group
                if (digitsGroup[m]) { // avoids 10000000 being read (one billion million)
                    digitsGroup[m] += ' ' + posfixRange[m];
                }
            }
        }

        // Joins all the string into one and returns it

        return digitsGroup.join(' ');
    };

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    getUniqueKey() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
            this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
}