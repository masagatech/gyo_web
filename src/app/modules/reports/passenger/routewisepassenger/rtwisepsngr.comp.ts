import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rtwisepsngr.comp.html',
    providers: [CommonService]
})

export class RouteWisePassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    batchDT: any = [];
    batchid: number = 0;

    routesDT: any = [];
    stopsDT: any = [];
    passengerDT: any = [];

    rtname: string = "";
    stpname: string = "";
    batchname: string = "";

    @ViewChild('rtwisepsngr') rtwisepsngr: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.getRouteWisePassengerReports();
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

    // Batch DropDown

    fillBatchDropDown() {
        var that = this;

        that._rptservice.getRouteWisePassengerReports({
            "flag": "batch",
            "id": that._enttdetails.enttid,
            "wsautoid": that._wsdetails.wsautoid
        }).subscribe((data) => {
            try {
                that.batchDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    // View Route List

    getRouteWisePassengerReports() {
        var that = this;

        commonfun.loader();

        that._rptservice.getRouteWisePassengerReports({
            "flag": "route", "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.routesDT = data.data;
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

    // View Route List

    getRouteWiseStops(row) {
        var that = this;
        that.stopsDT = [];

        commonfun.loader("#ddlstops");

        that._rptservice.getRouteWisePassengerReports({
            "flag": "stops", "enttid": row.enttid, "rtid": row.rtid, "batchid": row.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                row.stopsDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#ddlstops");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#ddlstops");
        }, () => {

        })
    }

    // View Passenger List

    getStopsWisePassenger(row) {
        var that = this;

        $("#passengerModal").modal('show');
        commonfun.loader("#passengerModal");

        that.passengerDT = [];

        that._rptservice.getRouteWisePassengerReports({
            "flag": "rtwise", "stpid": row.stpid, "enttid": row.schoolid, "rtid": row.rtid,
            "batchid": row.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.passengerDT = data.data;
                    that.rtname = data.data[0].rtname
                    that.stpname = data.data[0].stpname;
                    that.batchname = data.data[0].batchname;
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
            commonfun.loaderhide("#passengerModal");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#passengerModal");
        }, () => {

        })
    }

    // Export

    exportToCSV() {
        var that = this;

        commonfun.loader("#exportemp");

        that._rptservice.getRouteWisePassengerReports({
            "flag": "export", "enttid": that._enttdetails.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                this._autoservice.exportToCSV(data.data, "Unscheduled Passenger Details");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#exportemp");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#exportemp");
        }, () => {

        })
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.rtwisepsngr.nativeElement, 0, 0, options, () => {
            pdf.save("GroupWisePassenger.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
