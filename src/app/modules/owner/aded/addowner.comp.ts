import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { OwnerService } from '../../../_services/owner/owner-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'addowner.comp.html',
    providers: [OwnerService, CommonService]
})

export class AddOwnerComponent implements OnInit {
    ownerid: number = 0;
    ownercode: string = "";
    ownerpwd: string = "";
    ownername: string = "";
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

    private subscribeParameters: any;

    constructor(private _ownerervice: OwnerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        this.getOwnerDetails();
    }

    // Auto Completed School

    getSchoolData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "type": "school",
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
            var dataResult = data.data;

            if (dataResult[0].funsave_ownerinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_ownerinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.success, "Success", msg);
                that.getOwnerDetails();
            }
            else {
                var msg = dataResult[0].funsave_ownerinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.error, "Error", msg);
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
        console.log(_schlist);

        var saveowner = {
            "autoid": that.ownerid,
            "ownercode": that.ownercode,
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
            "uid": "vivek",
            "isactive": that.isactive,
            "mode": ""
        }

        this._ownerervice.saveOwnerInfo(saveowner).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_ownerinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_ownerinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.success, "Success", msg);
                that.getOwnerDetails();
                commonfun.loaderhide();
            }
            else {
                var msg = dataResult[0].funsave_ownerinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.error, "Error", msg);
                commonfun.loaderhide();
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
                    that.ownerid = data.data[0].autoid;
                    that.ownercode = data.data[0].ownercode;
                    that.ownerpwd = data.data[0].ownerpwd;
                    that.ownername = data.data[0].ownername;
                    that.schoolList = data.data[0].school !== null ? data.data[0].school : [];
                    that.lat = data.data[0].lat;
                    that.lon = data.data[0].lon;
                    that.aadharno = data.data[0].aadharno;
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

                    commonfun.loaderhide();
                }, err => {
                    //that._msg.Show(messageType.error, "Error", err);
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
