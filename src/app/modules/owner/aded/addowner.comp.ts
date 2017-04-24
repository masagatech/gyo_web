import { Component, OnInit } from '@angular/core';
import { OwnerService } from '../../../_services/owner/owner-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'addowner.comp.html',
    providers: [OwnerService]
})

export class AddOwnerComponent implements OnInit {
    ownerid: number = 0;
    ownercode: string = "";
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

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _ownerervice: OwnerService, private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        this.getOwnerDetails();
    }

    // Active / Deactive Data

    active_deactiveOwnerInfo(){
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

        var saveowner = {
            "autoid": that.ownerid,
            "ownercode": that.ownercode,
            "ownername": that.ownername,
            "aadharno": that.aadharno,
            "geoloc": that.lat + "," + that.lon,
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
                    that.ownername = data.data[0].ownername;
                    that.lat = data.data[0].geoloc.split(',')[0];
                    that.lon = data.data[0].geoloc.split(',')[1];
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
