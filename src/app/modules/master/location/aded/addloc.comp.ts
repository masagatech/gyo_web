import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LocationService } from '@services/master';;
import { LoginUserModel } from '@models';

declare let google: any;

@Component({
    templateUrl: 'addloc.comp.html',
    providers: [CommonService]
})

export class AddLocationComponent implements OnInit, AfterViewInit {
    loginUser: LoginUserModel;

    stateDT: any = [];
    stateid: number = 0;

    cityDT: any = [];
    ctid: number = 0;
    ctcd: string = "";
    ctnm: string = "";

    areaDT: any = [];
    arid: number = 0;
    arcd: string = "";
    arnm: string = "";

    arealist: any = [];

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _locservice: LocationService, private cdRef: ChangeDetectorRef, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.fillDropDownList();
    }

    public ngOnInit() {
    }

    // Clear Fields

    resetLocationFields() {
        this.ctcd = "";
        this.ctnm = "";
        this.arealist = [];
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        let that = this;
        commonfun.loader("#card");

        that._locservice.getLocationDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.stateDT = data.data;
                setTimeout(function () { $.AdminBSB.select.refresh('ddlstate'); }, 100)
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#card");
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#card");
        }, () => {

        })
    }

    // add area list

    isDuplicateArea() {
        let that = this;

        for (let i = 0; i < that.arealist.length; i++) {
            let field = that.arealist[i];

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
        let that = this;

        if (that.arcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Area Code");
        }
        else if (that.arnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Area Name");
        }
        else {
            let duplicatearea = that.isDuplicateArea();

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
        let that = this;

        let act_deactloc = {
            "ctid": that.ctid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._locservice.saveLocationInfo(act_deactloc).subscribe(data => {
            try {
                let dataResult = data.data;

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

        });
    }

    private saveLocationInfo(model) {
        let that = this;

        if (that.cd == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + this.modelnm + " Code");
            $(".code").focus();
            return;
        }
        else if (that.nm == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + this.modelnm + " Name");
            $(".name").focus();
            return;
        }

        commonfun.loader("#pop");

        this._locservice.saveLocationInfo(model).subscribe(data => {
            try {
                let dataResult = data.data;
                let msg = dataResult[0].funsave_locationinfo.msg;
                let msgid = dataResult[0].funsave_locationinfo.msgid;
                let type = dataResult[0].funsave_locationinfo.typ;
                let status = dataResult[0].funsave_locationinfo.status;

                if (status) {
                    if (type == "ins") {
                        if (that.modelnm == "City") {
                            that.cityDT.push({
                                "ctid": msgid,
                                "ctcd": model.cd,
                                "ctnm": model.nm,
                                "isactive": true
                            });

                            setTimeout(function () { $.AdminBSB.select.refresh('ddlcity'); }, 100);
                        } else {
                            that.areaDT.push({
                                "arid": msgid,
                                "arcd": model.cd,
                                "arnm": model.nm,
                                "isactive": true
                            });

                            setTimeout(function () { $.AdminBSB.select.refresh('ddlarea'); }, 100);
                        }
                    } else {
                        if (that.modelnm == "City") {
                            var elementPos = that.cityDT.map(function (x) { return x.ctid; }).indexOf(model.id);

                            that.cityDT[elementPos] = {
                                "ctid": msgid,
                                "ctcd": model.cd,
                                "ctnm": model.nm,
                                "isactive": true
                            };

                            setTimeout(function () { $.AdminBSB.select.refresh('ddlcity'); }, 100);
                        } else {
                            var elementPos = that.areaDT.map(function (x) { return x.arid; }).indexOf(model.id);

                            that.areaDT[elementPos] = {
                                "arid": msgid,
                                "arcd": model.cd,
                                "arnm": model.nm,
                                "isactive": true
                            };

                            setTimeout(function () { $.AdminBSB.select.refresh('ddlarea'); }, 100);
                        }
                    }

                    that._msg.Show(messageType.success, "Success", msg);
                    $("#pop").modal('hide');
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }

                commonfun.loaderhide("#pop");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
                commonfun.loaderhide("#pop");
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            commonfun.loaderhide("#pop");
        }, () => {

        });
    }

    private onStateChange(e) {
        if (this.stateid > 0) {
            this.fillCityDropDown();
        } else {
            this.cityDT = [];
            this.areaDT = [];
            this.ctid = 0;
            this.arid = 0;
            setTimeout(function () { $.AdminBSB.select.refresh('ddlcity'); }, 0)
        }
    }

    // Get City DropDown

    fillCityDropDown() {
        let that = this;

        commonfun.loader("#card");

        that.cityDT = [];
        that.areaDT = [];

        that._locservice.getLocationDetails({ "flag": "ctonst", "sid": that.stateid }).subscribe(data => {
            try {
                that.cityDT = data.data;
                setTimeout(function () { $.AdminBSB.select.refresh('ddlcity'); }, 100)
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#card");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#card");
        }, () => {

        })
    }

    private onCityChange(e) {
        let citydet = this.cityDT.filter(c => c.ctid == e);

        this.ctcd = citydet[0].ctcd;
        this.ctnm = citydet[0].ctnm;

        if (this.ctid > 0) {
            this.fillAreaDropDown();
        } else {
            this.ctid = 0;
            this.areaDT = [];

            setTimeout(function () { $.AdminBSB.select.refresh('ddlarea'); }, 0)
        }
    }

    private onAreaChange(e) {
        let areadet = this.areaDT.filter(a => a.arid == e);
        this.arcd = areadet[0].arcd;
        this.arnm = areadet[0].arnm;
    }

    fillAreaDropDown() {
        let that = this;
        commonfun.loader("#card");

        that.areaDT = [];

        that._locservice.getLocationDetails({ "flag": "aronct", "ctid": that.ctid }).subscribe(data => {
            try {
                that.areaDT = data.data;
                setTimeout(function () { $.AdminBSB.select.refresh('ddlarea'); }, 100)
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#card");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#card");
        }, () => {

        })
    }

    // Get Area Data

    modelnm: String = "";

    private onCityPlus() {
        if (this.stateid == 0) {
            this._msg.Show(messageType.warn, "Required", "Please select state!!");
        } else {
            this.modelnm = "City";
            this.id = 0;
            this.cd = "";
            this.nm = "";
            this.prid = this.stateid;
            $("#pop").modal("show");
        }
    }

    private onCityEdit() {
        if (this.stateid == 0) {
            this._msg.Show(messageType.warn, "Required", "Please select state!!");
        } else {
            this.modelnm = "City";
            this.id = this.ctid;
            this.cd = this.ctcd;
            this.nm = this.ctnm;
            this.prid = this.stateid;
            $("#pop").modal("show");
        }
    }

    private onAreaPlus() {
        if (this.ctid == 0) {
            this._msg.Show(messageType.warn, "Required", "Please select city!!");
        } else {
            $("#pop").modal("show");
            this.modelnm = "Area";
            this.id = 0;
            this.cd = "";
            this.nm = "";
            this.prid = this.ctid;
        }
    }

    private onAreaEdit() {
        if (this.ctid == 0) {
            this._msg.Show(messageType.warn, "Required", "Please select city!!");
        } else if (this.arid == 0) {
            this._msg.Show(messageType.warn, "Required", "Please select area!!");
        } else {
            $("#pop").modal("show");
            this.modelnm = "Area";
            this.id = this.arid;
            this.cd = this.arcd;
            this.nm = this.arnm;
            this.prid = this.ctid;
        }
    }

    // Get Location Data

    getLocationDetails() {
        let that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.ctid = params['id'];

                that._locservice.getLocationDetails({ "flag": "edit", "id": that.ctid }).subscribe(data => {
                    try {
                        let _locdata = data.data[0]._locdata;
                        let _attachdocs = data.data[0]._attachdocs;

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

    // Save Data

    cd: String = "";
    nm: String = "";
    id: Number = 0;
    prid: Number = 0;

    private save() {
        if (this.modelnm == "Area") {
            let saveloc = {
                "id": this.id,
                "cd": this.cd,
                "nm": this.nm,
                "pid": this.prid,
                "type": "area",
                "cuid": this.loginUser.ucode,
                "isactive": this.isactive,
                "mode": ""
            }

            this.saveLocationInfo(saveloc);
        }
        else if (this.modelnm == "City") {
            let saveloc = {
                "id": this.id,
                "cd": this.cd,
                "nm": this.nm,
                "pid": this.prid,
                "type": "city",
                "cuid": this.loginUser.ucode,
                "isactive": this.isactive,
                "mode": ""
            }

            this.saveLocationInfo(saveloc);
        }
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/location']);
    }

    public ngAfterViewInit() {
        let that = this;
        commonfun.chatinit();
        $.AdminBSB.select.activate();
    }
}