import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { OwnerService } from '../../../_services/owner/owner-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';

@Component({
    templateUrl: 'addowner.comp.html',
    providers: [OwnerService, CommonService]
})

export class AddOwnerComponent implements OnInit {
    loginUser: LoginUserModel;

    ownerid: number = 0;
    ownercode: string = "";
    oldcode: string = "";
    ownerpwd: string = "";
    ownername: string = "";
    typ: string = "Co-ordinator";
    isthirdparty: string = "N";
    aadharno: string = "";
    lat: string = "";
    lon: string = "";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: string = "";
    remark1: string = "";

    schoolDT: any = [];
    schoolList: any = [];
    schoolid: number = 0;
    schoolname: string = "";

    mode: string = "";
    isactive: boolean = true;

    ownerTypeDT: any = [];

    private subscribeParameters: any;

    constructor(private _ownerervice: OwnerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this.getOwnerType();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.rdbtnstyle();
        }, 0);

        this.getOwnerDetails();
    }

    getOwnerType() {
        this.ownerTypeDT.push({ "code": "cod", "name": "Co-ordinator" });
        this.ownerTypeDT.push({ "code": "att", "name": "Attendent" });
    }

    // Auto Completed School

    getSchoolData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "school",
            "search": query
        }).then((data) => {
            this.schoolDT = data;
        });
    }

    // Selected Owners

    selectSchoolData(event, type) {
        this.schoolid = event.value;
        this.schoolname = event.label;

        this.addSchoolList();
        $(".schoolname input").focus();
    }

    // Read Get School

    addSchoolList() {
        var that = this;

        that.schoolList.push({
            "schid": that.schoolid, "schnm": that.schoolname
        });

        that.schoolid = 0;
        that.schoolname = "";
    }

    deleteSchool(row) {
        this.schoolList.splice(this.schoolList.indexOf(row), 1);
    }

    // Active / Deactive Data

    active_deactiveOwnerInfo() {
        var that = this;

        var act_deactOwner = {
            "autoid": that.ownerid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._ownerervice.saveOwnerInfo(act_deactOwner).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_ownerinfo.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_ownerinfo.msg);
                    that.getOwnerDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_ownerinfo.msg);
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

    saveOwnerInfo() {
        var that = this;
        commonfun.loader();

        var _schlist: string[] = [];
        _schlist = Object.keys(that.schoolList).map(function (k) { return that.schoolList[k].schid });

        var saveowner = {
            "autoid": that.ownerid,
            "ownercode": that.ownercode,
            "oldcode": that.oldcode,
            "ownerpwd": that.ownerpwd,
            "ownername": that.ownername,
            "aadharno": that.aadharno,
            "geoloc": that.lat + "," + that.lon,
            "school": _schlist,
            "mobileno1": that.mobileno1,
            "mobileno2": that.mobileno2,
            "email1": that.email1,
            "email2": that.email2,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "pincode": that.pincode,
            "remark1": that.remark1,
            "typ": that.typ,
            "isthirdparty": that.isthirdparty,
            "uid": that.loginUser.ucode,
            "isactive": that.isactive,
            "mode": ""
        }

        this._ownerervice.saveOwnerInfo(saveowner).subscribe(data => {
            try {
                var dataResult = data.data;

                if (dataResult[0].funsave_ownerinfo.msgid != "-1") {
                    var msg = dataResult[0].funsave_ownerinfo.msg;
                    that._msg.Show(messageType.success, "Success", dataResult[0].funsave_ownerinfo.msg);
                    that.getOwnerDetails();
                    commonfun.loaderhide();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult[0].funsave_ownerinfo.msg);
                    commonfun.loaderhide();
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get owner Data

    getOwnerDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.ownerid = params['id'];

                that._ownerervice.getOwnerDetails({ "flag": "edit", "id": this.ownerid }).subscribe(data => {
                    try {
                        that.ownerid = data.data[0].autoid;
                        that.oldcode = data.data[0].ownercode;
                        that.ownercode = data.data[0].ownercode;
                        that.ownerpwd = data.data[0].ownerpwd;
                        that.ownername = data.data[0].ownername;
                        that.lat = data.data[0].lat;
                        that.lon = data.data[0].lon;
                        that.aadharno = data.data[0].aadharno;
                        that.schoolList = data.data[0].school !== null ? data.data[0].school : [];
                        that.typ = data.data[0].typ;
                        that.isthirdparty = data.data[0].isthirdparty;
                        that.email1 = data.data[0].email1;
                        that.email2 = data.data[0].email2;
                        that.mobileno1 = data.data[0].mobileno1;
                        that.mobileno2 = data.data[0].mobileno2;
                        that.address = data.data[0].address;
                        that.country = data.data[0].country;
                        that.state = data.data[0].state;
                        that.city = data.data[0].city;
                        that.pincode = data.data[0].pincode;
                        that.remark1 = data.data[0].remark1;
                        that.schoolname = data.data[0].schoolname;
                        that.isactive = data.data[0].isactive;
                        that.mode = data.data[0].mode;
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
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/owner']);
    }
}
