import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rpttrips.comp.html',
    providers: [MenuService, CommonService]
})

export class TripsReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    monthDT: any = [];
    monthname: string = "";

    tripsDT: any = [];

    doc = new jsPDF();

    @ViewChild('passenger') passenger: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getDefaultMonth();
        this.getAttendanceReports();
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

    getDefaultMonth() {
        let date = new Date();
        let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let mname = monthNames[date.getMonth()] + "-" + date.getFullYear().toString().substr(-2);

        this.monthname = mname;
    }

    // Export

    exportToExcel(e, table, name) {
        console.log(e);

        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return window.btoa(decodeURI(decodeURIComponent(s))) },
            format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; })
            }

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }
        window.location.href = uri + base64(format(template, ctx));

        return false;
    }

    public exportToCSV() {
        new Angular2Csv(this.tripsDT, 'TripsReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.passenger.nativeElement, 0, 0, options, () => {
            pdf.save("TripsReports.pdf");
        });
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._rptservice.getAttendanceReports({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.monthDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);

            commonfun.loaderhide();
        }, () => {

        })
    }

    // View Data Rights

    getAttendanceReports() {
        var that = this;

        if (that.monthname === "") {
            that._msg.Show(messageType.warn, "Warning", "Select Month");
        }
        else {
            commonfun.loader("#fltrpsngr");

            that._rptservice.getAttendanceReports({
                "flag": "trips", "monthname": that.monthname, "enttid": that._enttdetails.enttid
            }).subscribe(data => {
                try {
                    if (data.data.length == 0) {
                        that.tripsDT = [];
                    }
                    else if (data.data.length == 1) {
                        if (data.data[0].stdnm !== null) {
                            that.tripsDT = data.data;
                        }
                        else {
                            that.tripsDT = [];
                        }
                    }
                    else {
                        that.tripsDT = data.data;
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide("#fltrpsngr");
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide("#fltrpsngr");
            }, () => {

            })
        }
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
