import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { EntityService } from '../../../_services/entity/entity-service';
import { CommonService } from '../../../_services/common/common-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { Globals } from '../../../_const/globals';

declare var google: any;

@Component({
    templateUrl: 'addentity.comp.html',
    providers: [CommonService]
})

export class AddEntityComponent implements OnInit {
    loginUser: LoginUserModel;

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    schid: number = 0;
    schcd: string = "";
    schnm: string = "";
    lat: string = "0.00";
    lon: string = "0.00";
    schvehs: any = "";
    oprvehs: any = "";
    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;
    entttype: string = "";
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

    weekDT: any = [];
    entttypeDT: any = [];

    uploadPhotoDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _entityservice: EntityService,
        private _autoservice: CommonService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this.getUploadConfig();

        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();
    }

    public ngAfterViewInit() {
    }

    public ngOnInit() {
        $.AdminBSB.input.activate();
        $(".schcd").focus();
        this.getEntityDetails();
    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "dropdown", "wscode": that.loginUser.wscode }).subscribe(data => {
            try {
                that.entttypeDT = data.data.filter(a => a.group === "workspace");

                if (that.entttypeDT.length == 1) {
                    that.entttype = that.entttypeDT[0].key;
                }
                else {
                    that.entttypeDT.push({ "key": "", "val": "Select Entity Type" });
                    that.entttype = "";
                }

                that.weekDT = data.data.filter(a => a.group === "week");
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
            }
            else {
                that._msg.Show(messageType.error, "Error", "Couldn't find your Location");
            }

            commonfun.loaderhide();
        });
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
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

    // Get City DropDown

    fillCityDropDown() {
        var that = this;
        commonfun.loader();

        that.cityDT = [];
        that.areaDT = [];

        that.city = 0;
        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "city", "sid": that.state }).subscribe(data => {
            try {
                that.cityDT = data.data;
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

    // Get Area DropDown

    fillAreaDropDown() {
        var that = this;
        commonfun.loader();

        that.areaDT = [];

        that.area = 0;

        that._autoservice.getDropDownData({ "flag": "area", "ctid": that.city, "sid": that.state }).subscribe(data => {
            try {
                that.areaDT = data.data;
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

    isDuplicateContact() {
        for (var i = 0; i < this.contactDT.length; i++) {
            var field = this.contactDT[i];

            if (field.cpcontactno == this.cpmobile) {
                this._msg.Show(messageType.error, "Error", "Duplicate Contact No not Allowed");
                return true;
            }
            if (field.cpemail == this.cpemail) {
                this._msg.Show(messageType.error, "Error", "Duplicate Email not Allowed");
                return true;
            }
        }

        return false;
    }

    private addCPRow() {
        var that = this;

        // Validation

        if (that.cpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Name");
            $(".cpname").focus();
            return;
        }

        if (that.cpmobile == "") {
            that._msg.Show(messageType.error, "Error", "Enter Contact No");
            $(".cpmobile").focus();
            return;
        }

        if (that.cpemail == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email");
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

    // File upload

    onUpload(event) {
        var that = this;
        var imgfile = [];
        imgfile = JSON.parse(event.xhr.response);

        console.log(imgfile);

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace("www\\uploads\\", "") })
        }
    }

    // Get File Size

    formatSizeUnits(bytes) {
        if (bytes >= 1073741824) {
            bytes = (bytes / 1073741824).toFixed(2) + ' GB';
        }
        else if (bytes >= 1048576) {
            bytes = (bytes / 1048576).toFixed(2) + ' MB';
        }
        else if (bytes >= 1024) {
            bytes = (bytes / 1024).toFixed(2) + ' KB';
        }
        else if (bytes > 1) {
            bytes = bytes + ' bytes';
        }
        else if (bytes == 1) {
            bytes = bytes + ' byte';
        }
        else {
            bytes = '0 byte';
        }

        return bytes;
    }

    removeFileUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": "29" }).subscribe(data => {
            that.uploadconfig.server = that.global.serviceurl + "uploads";
            that.uploadconfig.serverpath = that.global.serviceurl;
            that.uploadconfig.uploadurl = that.global.uploadurl;
            that.uploadconfig.maxFilesize = data.data[0]._filesize;
            that.uploadconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Clear Fields

    resetentityFields() {
        var that = this;

        that.entttype = "";
        that.schcd = "";
        that.schnm = "";
        that.schvehs = "";
        that.oprvehs = "";
        that.remark1 = "";
        that.address = "";
        that.lat = "0.00";
        that.lon = "0.00";
        that.country = "India";
        that.state = 0;
        that.city = 0;
        that.area = 0;
        that.pincode = 0;
    }

    // Active / Deactive Data

    active_deactiveEntityInfo() {
        var that = this;

        var act_deactentity = {
            "autoid": that.schid,
            "isactive": that.isactive,
            "mode": that.mode
        }

        this._entityservice.saveEntityInfo(act_deactentity).subscribe(data => {
            try {
                var dataResult = data.data;
                var msg = dataResult[0].funsave_schoolinfo.msg;
                var msgid = dataResult[0].funsave_schoolinfo.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getEntityDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
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

    // Save entity Data

    saveEntityInfo() {
        var that = this;
        var mweek = null;
        var weeklyoff = "";

        if (that.entttype == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Type");
            $(".entttype").focus();
        }
        else if (that.schcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Code");
            $(".schcd").focus();
        }
        else if (that.schnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".schnm").focus();
        }
        else if (that.schvehs == "") {
            that._msg.Show(messageType.error, "Error", "Enter How Many Entity Vehicles");
            $(".schvehs").focus();
        }
        else if (that.oprvehs == "") {
            that._msg.Show(messageType.error, "Error", "Enter How Many Operator Vehicles");
            $(".oprvehs").focus();
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
        }
        else if (that.lat == "") {
            that._msg.Show(messageType.error, "Error", "Enter Late");
            $(".lat").focus();
        }
        else if (that.lon == "") {
            that._msg.Show(messageType.error, "Error", "Enter Lon");
            $(".lon").focus();
        }
        else {
            for (var i = 0; i <= that.weekDT.length - 1; i++) {
                mweek = null;
                mweek = that.weekDT[i];

                if (mweek !== null) {
                    var wkrights = "";

                    $("#week").find("input[type=checkbox]").each(function () {
                        wkrights += (this.checked ? $(this).val() + "," : "");
                    });
                }
            }

            weeklyoff = "{" + wkrights.slice(0, -1) + "}";

            if (weeklyoff == "") {
                this._msg.Show(messageType.error, "Error", "Atleast select 1 Week Days");
            }
            else {
                commonfun.loader();

                var saveentity = {
                    "autoid": that.schid,
                    "entttype": that.entttype,
                    "schcd": that.schcd,
                    "schnm": that.schnm,
                    "schlogo": that.uploadPhotoDT[0].athurl,
                    "schgeoloc": that.lat + "," + that.lon,
                    "schvehs": that.schvehs,
                    "oprvehs": that.oprvehs,
                    "weeklyoff": weeklyoff,
                    "address": that.address,
                    "country": that.country,
                    "state": that.state,
                    "city": that.city,
                    "area": that.area,
                    "pincode": that.pincode,
                    "name": that.name,
                    "mob1": that.mobile,
                    "mob2": that.mobile,
                    "email1": that.email,
                    "email2": that.email,
                    "contact": that.contactDT,
                    "remark1": that.remark1,
                    "uid": that.loginUser.ucode
                }

                this._entityservice.saveEntityInfo(saveentity).subscribe(data => {
                    try {
                        var dataResult = data.data;
                        var msg = dataResult[0].funsave_schoolinfo.msg;
                        var msgid = dataResult[0].funsave_schoolinfo.msgid;

                        if (msgid != "-1") {
                            this._msg.Show(messageType.success, "Success", msg);

                            if (msgid === "1") {
                                that.resetentityFields();
                            }
                            else {
                                that.backViewData();
                            }
                        }
                        else {
                            this._msg.Show(messageType.error, "Error", msg);
                        }

                        commonfun.loaderhide();
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide();
                }, err => {
                    console.log(err);
                    commonfun.loaderhide();
                }, () => {
                    // console.log("Complete");
                });
            }
        }
    }

    // Get entity Data

    getEntityDetails() {
        var that = this;
        commonfun.loader();

        this.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                this.schid = params['id'];

                that._entityservice.getEntityDetails({ "flag": "edit", "id": this.schid }).subscribe(data => {
                    try {
                        that.schid = data.data[0].autoid;
                        that.entttype = data.data[0].entttype;
                        that.schcd = data.data[0].schoolcode;
                        that.schnm = data.data[0].schoolname;

                        that.getUploadConfig();
                        that.uploadPhotoDT.push({ "athurl":  that.uploadconfig.uploadurl + data.data[0].schlogo });
                        that.lat = data.data[0].lat;
                        that.lon = data.data[0].lon;
                        that.schvehs = data.data[0].ownbuses;
                        that.oprvehs = data.data[0].vanoperator;

                        var weeklyoff = data.data[0].weeklyoff;

                        if (weeklyoff != null) {
                            for (var i = 0; i < weeklyoff.length; i++) {
                                $("#week").find("#" + weeklyoff[i]).prop('checked', true);
                            }
                        }

                        that.address = data.data[0].address;
                        that.state = data.data[0].state;
                        that.fillCityDropDown();
                        that.city = data.data[0].city;
                        that.fillAreaDropDown();
                        that.area = data.data[0].area;
                        that.pincode = data.data[0].pincode;

                        that.name = data.data[0].name;
                        that.email = data.data[0].email1;
                        that.mobile = data.data[0].mobileno1;
                        that.contactDT = data.data[0].contact !== null ? data.data[0].contact : [];

                        that.remark1 = data.data[0].remark1;
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
        this._router.navigate(['/entity']);
    }
}
