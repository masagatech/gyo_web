import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from '../../../_services/common/common-service'; /* add reference for master of master */
import { OwnerService } from '../../../_services/owner/owner-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';

declare var google: any;

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
    typ: string = "coord";
    isthirdparty: string = "N";
    aadharno: string = "";
    lat: string = "0.00";
    lon: string = "0.00";
    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    country: string = "";
    state: string = "";
    city: string = "";
    pincode: number = 0;
    remark1: string = "";

    entityDT: any = [];
    entityList: any = [];
    entityid: number = 0;
    entityname: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _ownerervice: OwnerService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _router: Router, private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.rdbtnstyle();
        }, 0);

        this.getOwnerDetails();
    }

    // get lat and long by address form google map

    getLatAndLong() {
        var that = this;
        commonfun.loader();

        var geocoder = new google.maps.Geocoder();
        // var address = "Chakkinaka, Kalyan (E)";

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.lon = results[0].geometry.location.lng();

                commonfun.loaderhide();
            }
        });
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "search": query
        }).then((data) => {
            this.entityDT = data;
        });
    }

    // Selected Owners

    selectEntityData(event, type) {
        this.entityid = event.value;
        this.entityname = event.label;

        this.addEntityList();
        $(".entityname input").focus();
    }

    // Check Duplicate Entity

    isDuplicateEntity() {
        var that = this;

        for (var i = 0; i < that.entityList.length; i++) {
            var field = that.entityList[i];

            if (field.schid == this.entityid) {
                this._msg.Show(messageType.error, "Error", "Duplicate Entity not Allowed");
                return true;
            }
        }

        return false;
    }

    // Read Get Entity

    addEntityList() {
        var that = this;
        var duplicateEntity = that.isDuplicateEntity();

        if (!duplicateEntity) {
            that.entityList.push({
                "schid": that.entityid, "schnm": that.entityname
            });
        }

        that.entityid = 0;
        that.entityname = "";
    }

    deleteEntity(row) {
        this.entityList.splice(this.entityList.indexOf(row), 1);
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

    // Clear Fields

    resetOwnerFields() {
        $("input").val("");
        $("textarea").val("");
        $("select").val("");

        this.lat = "0.00";
        this.lon = "0.00";
        this.pincode = 0;

        this.entityList = [];
    }

    // Save Data

    saveOwnerInfo() {
        var that = this;

        if (that.ownercode == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.typ == "coord" ? "Co-ordinator" : "Attendent Code");
            $(".ownercode").focus();
        }
        else if (that.ownerpwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".ownerpwd").focus();
        }
        else if (that.ownername == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.typ == "coord" ? "Co-ordinator" : "Attendent Name");
            $(".ownername").focus();
        }
        else if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
        }
        else if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
            $(".email1").focus();
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else if (that.entityList.length == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Atleast 1 Entity");
            $(".entityname input").focus();
        }
        else {
            commonfun.loader();

            var _entitylist: string[] = [];
            _entitylist = Object.keys(that.entityList).map(function (k) { return that.entityList[k].schid });

            var saveowner = {
                "autoid": that.ownerid,
                "ownercode": that.ownercode,
                "oldcode": that.oldcode,
                "ownerpwd": that.ownerpwd,
                "ownername": that.ownername,
                "aadharno": that.aadharno,
                "geoloc": that.lat + "," + that.lon,
                "school": _entitylist,
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
                    var msg = dataResult[0].funsave_ownerinfo.msg;
                    var msgid = dataResult[0].funsave_ownerinfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetOwnerFields();
                        }
                        else {
                            that.backViewData();
                        }

                        commonfun.loaderhide();
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
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
                        that.entityList = data.data[0].school !== null ? data.data[0].school : [];
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
                        that.entityname = data.data[0].schoolname;
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
