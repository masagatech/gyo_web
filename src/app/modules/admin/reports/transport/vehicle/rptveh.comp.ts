import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptveh.comp.html'
})

export class VehicleReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    entityDT: any = [];
    vehicleDT: any = [];

    enttid: number = 0;
    srcvehname: string = "";

    @ViewChild('vehicle') vehicle: ElementRef;

    constructor(private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _vehservice: VehicleService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillSchoolDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill School Drop Down

    fillSchoolDropDown() {
        var that = this;
        var defschoolDT: any = [];

        commonfun.loader();

        that._autoservice.getDropDownData({
            "flag": "school", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": 0, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.entityDT = data.data;

                if (that.entityDT.length > 0) {
                    defschoolDT = that.entityDT.filter(a => a.iscurrent == true);

                    if (defschoolDT.length > 0) {
                        that.enttid = defschoolDT[0].enttid;
                    }
                    else {
                        if (sessionStorage.getItem("_schenttdetails_") == null && sessionStorage.getItem("_schenttdetails_") == undefined) {
                            that.enttid = 0;
                        }
                        else {
                            that.enttid = that._enttdetails.enttid;
                        }
                    }

                    that.getVehicleDetails();
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

    // Get Driver

    getVehicleDetails() {
        var that = this;
        commonfun.loader();

        that._vehservice.getVehicleDetails({
            "flag": "reports", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that.enttid, "wsautoid": 0, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.vehicleDT = data.data;
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

    public openTripTrackDB(row) {
        this._router.navigate(['/admin/triptrackingv1'], {
            queryParams: { "enttid": row.enttid, "vehid": row.autoid, "vehname": row.vehiclename, "imei": row.imei }
        });
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.vehicleDT, "Vehicle Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.vehicle.nativeElement, 0, 0, options, () => {
            pdf.save("VehicleReports.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
