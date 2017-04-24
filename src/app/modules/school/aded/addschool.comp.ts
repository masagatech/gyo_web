import { Component, OnInit } from '@angular/core';
import { SchoolService } from '../../../_services/school/school-service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'addschool.comp.html',
    providers: [SchoolService]
})

export class AddSchoolComponent implements OnInit {
    schid: number = 0;
    schcd: string = "";
    schnm: string = "";
    lat: string = "";
    lon: string = "";
    schvehs: any = "";
    oprvehs: any = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: string = "";
    remark1: string = "";

    name: string = "";
    mobile: string = "";
    email: string = "";

    counter: number = 0;
    cpname: string = "";
    cpmobile: string = "";
    cpemail: string = "";

    mode: string = "";
    isactive: boolean = true;

    contactDT: any = [];
    duplicateContact: boolean = true;

    private subscribeParameters: any;

    constructor(private _schoolservice: SchoolService, private _routeParams: ActivatedRoute, private _router: Router) {

    }

    public ngOnInit() {
        $(".schcd").focus();
        this.getSchoolDetails();
    }

    isDuplicateContact() {
        for (var i = 0; i < this.contactDT.length; i++) {
            var field = this.contactDT[i];

            if ((field.cpname == this.cpname) && (field.contactno == this.cpmobile) && (field.email == this.cpemail)) {
                // this._msg.Show(messageType.error, "Error", "Duplicate Contact not Allowed");
                alert("Duplicate Contact not Allowed");
                return true;
            }
        }

        return false;
    }

    private addCPRow() {
        var that = this;

        // Validation

        if (that.cpname == "") {
            // that._msg.Show(messageType.error, "Error", "Please Enter Name");
            alert("Please Enter Name");
            $(".cpname").focus();
            return;
        }

        if (that.cpmobile == "") {
            // that._msg.Show(messageType.error, "Error", "Please Enter Contact No");
            alert("Please Enter Contact No");
            $(".cpmobile").focus();
            return;
        }

        if (that.cpemail == "") {
            // that._msg.Show(messageType.error, "Error", "Please Enter Email");
            alert("Please Enter Email");
            $(".cpemail").focus();
            return;
        }

        // Duplicate items Check
        that.duplicateContact = that.isDuplicateContact();

        // Add New Row
        if (that.duplicateContact === false) {
            that.contactDT.push({
                'cpname': that.cpname,
                'cpcontactno': that.cpmobile,
                'cpemail': that.cpemail
            });

            that.counter++;
            that.cpname = "";
            that.cpmobile = "";
            that.cpemail = "";

            $(".cpname").focus();
        }
    }

    deleteCPRow(row) {
        this.contactDT.splice(this.contactDT.indexOf(row), 1);
    }

    // Active / Deactive Data

    active_deactiveSchoolInfo() {
        var that = this;

        var act_deactSchool = {
            "autoid": that.schid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._schoolservice.saveSchoolInfo(act_deactSchool).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_schoolinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_schoolinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.success, "Success", msg);
                that.getSchoolDetails();
            }
            else {
                var msg = dataResult[0].funsave_schoolinfo.msg;
                alert(msg);
                // that._msg.Show(messageType.error, "Error", msg);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Save School Data

    saveSchoolInfo() {
        var that = this;
        commonfun.loader();

        var saveSchool = {
            "autoid": that.schid,
            "schcd": that.schcd,
            "schnm": that.schnm,
            "schgeoloc": that.lat + "," + that.lon,
            "schvehs": that.schvehs,
            "oprvehs": that.oprvehs,
            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "pincode": that.pincode,
            "name": that.name,
            "mob1": that.mobile,
            "mob2": that.mobile,
            "email1": that.email,
            "email2": that.email,
            "contact": that.contactDT,
            "remark1": that.remark1,
            "uid": "vivek"
        }

        this._schoolservice.saveSchoolInfo(saveSchool).subscribe(data => {
            var dataResult = data.data;

            if (dataResult[0].funsave_schoolinfo.msgid != "-1") {
                var msg = dataResult[0].funsave_schoolinfo.msg;

                alert(msg);
                commonfun.loaderhide();
                // this._msg.Show(messageType.success, "Success", msg);
            }
            else {
                var msg = dataResult[0].funsave_schoolinfo.msg;
                alert(msg);
                commonfun.loaderhide();
                // this._msg.Show(messageType.error, "Error", msg);
            }
        }, err => {
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
        });
    }

    // Get School Data

    getSchoolDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.schid = params['id'];

                that._schoolservice.getSchoolDetails({ "flag": "edit", "id": this.schid }).subscribe(data => {
                    that.schid = data.data[0].autoid;
                    that.schcd = data.data[0].schoolcode;
                    that.schnm = data.data[0].schoolname;
                    that.lat = data.data[0].geoloc.split(',')[0];
                    that.lon = data.data[0].geoloc.split(',')[1];
                    that.schvehs = data.data[0].ownbuses;
                    that.oprvehs = data.data[0].vanoperator;
                    that.address = data.data[0].address;
                    that.country = data.data[0].country;
                    that.state = data.data[0].state;
                    that.city = data.data[0].city;
                    that.pincode = data.data[0].pincode;

                    that.name = data.data[0].name;
                    that.email = data.data[0].email1;
                    that.mobile = data.data[0].mobileno1;
                    that.contactDT = data.data[0].contact;

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
        this._router.navigate(['/school']);
    }
}
