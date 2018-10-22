import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { ReportsService } from '@services/reports';

@Component({
    templateUrl: 'rptveh.comp.html'
})

export class VehicleMasterReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    entityDT: any = [];
    vehicleDT: any = [];

    enttid: number = 0;

    constructor(private _router: Router, private _msg: MessageService, private _loginservice: LoginService,
        private _autoservice: CommonService, private _rptservice: ReportsService) {
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

                    that.getVehicleReports("html");
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

    // Get Vehicle Reports

    public getVehicleReports(format) {
        var that = this;

        var dparams = {
            "flag": "mst_reports", "enttid": that.enttid, "wsautoid": 0, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin, "format": format
        }

        commonfun.loader();

        if (format == "html") {
            that._rptservice.getVehicleReports(dparams).subscribe(data => {
                try {
                    $("#divrptvehmst").html(data._body);
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
        else {
            window.open(Common.getReportUrl("getVehicleReports", dparams));
            commonfun.loaderhide();
        }
    }

    public openTripTrackDB(row) {
        this._router.navigate(['/admin/triptrackingv1'], {
            queryParams: { "enttid": row.enttid, "vehid": row.autoid, "vehname": row.vehiclename, "imei": row.imei }
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
