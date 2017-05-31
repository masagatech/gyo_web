import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationService } from '../../../../_services/location/loc-service';
import { CommonService } from '../../../../_services/common/common-service' /* add reference for view file type */
import { MessageService, messageType } from '../../../../_services/messages/message-service';
import { LoginService } from '../../../../_services/login/login-service';
import { LoginUserModel } from '../../../../_model/user_model';

declare var google: any;

@Component({
    templateUrl: 'addloc.comp.html',
    providers: [CommonService]
})

export class AddLocationComponent implements OnInit {
    loginUser: LoginUserModel;

    stateDT: any = [];
    stateid: number = 0;

    ctid: number = 0;
    ctcd: string = "";
    ctnm: string = "";

    arid: number = 0;
    arcd: string = "";
    arnm: string = "";

    arealist: any = [];

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _locservice: LocationService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _commonservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getLocationDetails();
    }

    // Clear Fields

    resetLocationFields() {
        this.ctcd = "";
        this.ctnm = "";
        this.arealist = [];
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._locservice.getLocationDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.stateDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // add area list

    isDuplicateArea() {
        var that = this;

        for (var i = 0; i < that.arealist.length; i++) {
            var field = that.arealist[i];

            if (field.arcd == that.arcd) {
                that._msg.Show(messageType.error, "Error", "Duplicate Area Code Not Allowed");
                return true;
            }
            else if (field.arnm == that.arnm) {
                that._msg.Show(messageType.error, "Error", "Duplicate Area Name Not Allowed");
                return true;
            }
        }

        return false;
    }

    addAreaList() {
        var that = this;

        if (that.arcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Area Code");
        }
        else if (that.arnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Area Name");
        }
        else {
            var duplicatearea = that.isDuplicateArea();

            if (!duplicatearea) {
                that.arealist.push({
                    "arid": that.arid, "arcd": that.arcd, "arnm": that.arnm, "isactive": true
                })
            }

            that.arcd = "";
            that.arnm = "";
        }
    }

    // Active / Deactive Data

    active_deactiveLocationInfo() {
        var that = this;

        var act_deactloc = {
            "ctid": that.ctid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._locservice.saveLocationInfo(act_deactloc).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_locationinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_locinfo.msg);
                    that.getLocationDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_locinfo.msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Save Data

    saveLocationInfo() {
        var that = this;

        if (that.stateid == 0) {
            that._msg.Show(messageType.error, "Error", "Select State Name");
            $(".loccode").focus();
        }
        else if (that.ctcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter City Code");
            $(".loccode").focus();
        }
        else if (that.ctnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter City Name");
            $(".locname").focus();
        }
        else if (that.arealist.length == 0) {
            that._msg.Show(messageType.error, "Error", "Fill atleast 1 Area");
        }
        else {
            commonfun.loader();

            var saveloc = {
                "ctid": that.ctid,
                "ctcd": that.ctcd,
                "ctnm": that.ctnm,
                "pid": that.stateid,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": "",
                "arealist": that.arealist
            }

            this._locservice.saveLocationInfo(saveloc).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_locationinfo.msg;
                    var msgid = dataResult[0].funsave_locationinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetLocationFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Area Data

    getAreaByCity() {
        var that = this;
        commonfun.loader();

        that._locservice.getLocationDetails({ "flag": "area", "ctcd": that.ctcd }).subscribe(data => {
            try {
                var _locdata = data.data;

                if (_locdata.length > 0) {
                    that.ctnm = _locdata[0].ctnm;
                    that.arealist = _locdata;
                }
                else {
                    that.ctnm = "";
                    that.arealist = [];
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

    // Get Location Data

    getLocationDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ctid = params['id'];

                that._locservice.getLocationDetails({ "flag": "edit", "id": that.ctid }).subscribe(data => {
                    try {
                        var _locdata = data.data[0]._locdata;
                        var _attachdocs = data.data[0]._attachdocs;

                        that.ctcd = _locdata[0].loccode;
                        that.ctnm = _locdata[0].locname;
                        that.isactive = _locdata[0].isactive;
                        that.mode = _locdata[0].mode;
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    commonfun.loaderhide();
                }, () => {

                })
            }
            else {
                that.resetLocationFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/location']);
    }
}
