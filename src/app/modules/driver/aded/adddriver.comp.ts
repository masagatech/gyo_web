import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../../_services/driver/driver-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'adddriver.comp.html',
    providers: [DriverService]
})

export class AddDriverComponent implements OnInit {
    driverid: number = 0;
    drivercode: string = "";
    drivername: string = "";
    ownerid: number = 0;
    aadharno: string = "";
    licenseno: string = "";
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

    ownerDT: any = [];

    private subscribeParameters: any;

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getDriverDetails();
    }

    // Fill Owner Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._driverservice.getDriverDetails({ "flag": "dropdown" }).subscribe(data => {
            that.ownerDT = data.data;
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Active / Deactive Data

    active_deactiveDriverInfo(){
        var that = this;

        var act_deactDriver = {
            "autoid": that.driverid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._driverservice.saveDriverInfo(act_deactDriver).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_driverinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_driverinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.success, "Success", msg);
                that.getDriverDetails();
            }
            else {
                var msg = dataResult[0].funsave_driverinfo.msg;
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

    saveDriverInfo() {
        var that = this;
        commonfun.loader();

        var saveDriver = {
            "autoid": that.driverid,
            "drivercode": that.drivercode,
            "drivername": that.drivername,
            "aadharno": that.aadharno,
            "licenseno": that.licenseno,
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
            "ownerid": that.ownerid,
            "remark1": that.remark1,
            "uid": "vivek",
            "isactive": that.isactive,
            "mode": ""
        }

        this._driverservice.saveDriverInfo(saveDriver).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_driverinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_driverinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.success, "Success", msg);
                that.getDriverDetails();
                commonfun.loaderhide();
            }
            else {
                var msg = dataResult[0].funsave_driverinfo.msg;
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

    // Get Driver Data

    getDriverDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.driverid = params['id'];

                that._driverservice.getDriverDetails({ "flag": "edit", "id": this.driverid }).subscribe(data => {
                    that.driverid = data.data[0].autoid;
                    that.drivercode = data.data[0].drivercode;
                    that.drivername = data.data[0].drivername;
                    that.lat = data.data[0].geoloc.split(',')[0];
                    that.lon = data.data[0].geoloc.split(',')[1];
                    that.aadharno = data.data[0].aadharno;
                    that.licenseno = data.data[0].licenseno;
                    that.email1 = data.data[0].email1;
                    that.email2 = data.data[0].email2;
                    that.mobileno1 = data.data[0].mobileno1;
                    that.mobileno2 = data.data[0].mobileno2;
                    that.address = data.data[0].address;
                    that.country = data.data[0].country;
                    that.state = data.data[0].state;
                    that.city = data.data[0].city;
                    that.pincode = data.data[0].pincode;
                    that.ownerid = data.data[0].ownerid;
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
        this._router.navigate(['/driver']);
    }
}
