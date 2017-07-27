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
    tripsDT: any = [];
    
    monthname: string = "";

    doc = new jsPDF();

    specialElementHandlers = {
        '#editor': function (element, renderer) {
            return true;
        }
    };

    standardDT: any = [];
    standard: string = "";

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    passengerDT: any = [];

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

    public exportToCSV() {
        new Angular2Csv(this.passengerDT, 'PassengerReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF();

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.passenger.nativeElement, 0, 0, options, () => {
            pdf.save("PassengerReports.pdf");
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
