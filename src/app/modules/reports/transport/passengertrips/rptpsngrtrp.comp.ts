import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/reports';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptpsngrtrp.comp.html',
    providers: [CommonService]
})

export class PassengerTripsReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmdt: any = "";
    todt: any = "";

    passengerTripsDT: any = [];
    exportPassengerTripsDT: any = [];

    doc = new jsPDF();

    @ViewChild('passenger') passenger: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.getPassengerTripReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Selected Calendar Date

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    // Format Date

    setFromDateAndToDate() {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(today);
        this.todt = this.formatDate(today);
    }

    // View Data Rights

    getPassengerTripReports() {
        var that = this;

        commonfun.loader("#tblpsngrtrprpt");

        that._rptservice.getPassengerTripReports({
            "flag": "summary", "frmdt": that.frmdt, "todt": that.todt, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                if (data.data.length == 0) {
                    that.passengerTripsDT = [];
                }
                else if (data.data.length == 1) {
                    if (data.data[0].stdnm !== null) {
                        that.passengerTripsDT = data.data;
                    }
                    else {
                        that.passengerTripsDT = [];
                    }
                }
                else {
                    that.passengerTripsDT = data.data;
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#tblpsngrtrprpt");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#tblpsngrtrprpt");
        }, () => {

        })
    }

    // Expand Passenger Trip Details

    expanTripDetails(row) {
        let that = this;

        if (row.issh == 0) {
            row.issh = 1;

            if (row.details.length === 0) {
                var params = {
                    "flag": "details", "enttid": that._enttdetails.enttid, "frmdt": that.frmdt, "todt": that.todt,
                    "pdtype": row.pdtype, "trpdate": row.trpdate, "btcid": row.batchid, "drvid": row.driverid
                }

                that._rptservice.getPassengerTripReports(params).subscribe(data => {
                    row.details = data.data;

                    for (var i = 0; i < row.details.length; i++) {
                        if (row.details[i].issh == 0) {
                            row.details[i].issh = false;
                        }
                        else {
                            row.details[i].issh = true;
                        }
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                }, () => {

                })
            }
        } else {
            row.issh = 0;
        }
    }

    // Export

    public exportToCSV() {
        var that = this;

        commonfun.loader("#tblpsngrtrprpt");

        that._rptservice.getPassengerTripReports({
            "flag": "export", "frmdt": that.frmdt, "todt": that.todt, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                if (data.data.length == 0) {
                    that.exportPassengerTripsDT = [];
                }
                else if (data.data.length == 1) {
                    if (data.data[0].stdnm !== null) {
                        that.exportPassengerTripsDT = data.data;
                        that._autoservice.exportToCSV(that.exportPassengerTripsDT, "Passenger Trip Details");
                    }
                    else {
                        that.exportPassengerTripsDT = [];
                    }
                }
                else {
                    that.exportPassengerTripsDT = data.data;
                    that._autoservice.exportToCSV(that.exportPassengerTripsDT, "Passenger Trip Details");
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#tblpsngrtrprpt");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#tblpsngrtrprpt");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.passenger.nativeElement, 0, 0, options, () => {
            pdf.save(this._enttdetails.psngrtype + " Trips Reports.pdf");
        });
    }

    exportToExcel(e, table, name) {
        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return window.btoa(decodeURI(decodeURIComponent(s))) },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
            }

        if (!table.nodeType) { table = document.getElementById(table) }
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx));

        return false;
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
