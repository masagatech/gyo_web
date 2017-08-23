import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReportsService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'directpsngr.comp.html',
    providers: [CommonService]
})

export class DirectPassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    batchDT: any = [];
    batchid: number = 0;

    stopsDT: any = [];
    passengerDT: any = [];

    headerTitle: string = "";

    @ViewChild('dirpsngr') dirpsngr: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _rptservice: ReportsService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillBatchDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.passengerDT, "Direct Passenger Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.dirpsngr.nativeElement, 0, 0, options, () => {
            pdf.save("DirectPassenger.pdf");
        });
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
                // setTimeout(function () { $.AdminBSB.select.refresh('batchid'); }, 100);
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

    // View Passenger List

    getDirectPassenger() {
        var that = this;
        commonfun.loader();

        that._rptservice.getRouteWisePassengerReports({
            "flag": "nortwise", "enttid": that._enttdetails.enttid, "batchid": that.batchid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.passengerDT = data.data;
                }
                else {
                    that.passengerDT = [];
                }
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
