import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { Globals, Common, LoginUserModel } from '@models';
import { ReportsService } from '@services/reports';

@Component({
    templateUrl: 'rptspeed.comp.html',
    providers: [CommonService]
})

export class SpeedReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    vehicleDT: any = [];
    vehids: string = "";
    vehnames: string = "";

    flag: string = "summary";
    frmdt: string = "";
    todt: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _rptservice: ReportsService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.setFromDateAndToDate();
        this.fillVehicleDropDown();
    }

    public ngOnInit() {

    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    setFromDateAndToDate() {
        var date = new Date();
        var before1month = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(before1month);
        this.todt = this.formatDate(today);
    }

    openVehicelPopup() {
        $("#vehicleimei").modal('show');
    }

    closeVehiclePopup() {
        $("#vehicleimei").modal('hide');
    }

    fillVehicleDropDown() {
        let that = this;
        let params = {};

        params = {
            "flag": "vehicle", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }

        commonfun.loader();

        that._autoservice.getDropDownData(params).subscribe(data => {
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

        });
    }

    // Vehicle Checkboxes

    private selectAndDeselectAllVehicleCheckboxes() {
        if ($("#selectallvehicle").is(':checked')) {
            $(".allvehiclecheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allvehiclecheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private clearVehicleCheckboxes() {
        $(".allvehiclecheckboxes input[type=checkbox]").prop('checked', false);
    }

    // Get Vehicle Rights

    getVehicleRights() {
        var that = this;
        var vehitem = null;

        var _vehids = "";
        var _vehnames = "";

        var _vehidrights = "";
        var _vehnamerights = "";

        for (var i = 0; i <= that.vehicleDT.length - 1; i++) {
            vehitem = null;
            vehitem = that.vehicleDT[i];

            if (vehitem !== null) {
                $("#vehicle" + vehitem.imei).find("input[type=checkbox]").each(function () {
                    _vehidrights += (this.checked ? $(this).val() + "," : "");
                    _vehnamerights += (this.checked ? vehitem.vehicleno + ", " : "");
                });

                if (_vehidrights != "") {
                    _vehids = _vehidrights.slice(0, -1);
                    _vehnames = _vehnamerights.slice(0, -1);
                }
            }
        }

        that.vehids = _vehids;
        that.vehnames = _vehnames;
    }

    private getSpeedReports(format) {
        let that = this;
        let params = {};

        params = {
            "flag": that.flag, "rpttype": "speed", "vhid": that.vehids, "frmdt": that.frmdt, "todt": that.todt,
            "vwtype": "download", "format": format
        }

        if (format == "html") {
            commonfun.loader();

            that._rptservice.getReports(params).subscribe(data => {
                try {
                    $("#divspeed").html(data._body);
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

            });
        }
        else {
            window.open(Common.getReportUrl("getReports", params));
        }
    }

    applyVehicleSearch() {
        this.getVehicleRights();
        this.getSpeedReports("html");
        this.closeVehiclePopup();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
