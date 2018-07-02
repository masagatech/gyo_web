import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';
import { GMap } from 'primeng/primeng';

declare var google: any;

@Component({
    templateUrl: 'addentity.comp.html'
})

export class AddEntityComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    marker: any;
    @ViewChild("gmap")
    _gmap: GMap;

    private overlays: any[];
    private map: any;

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    schid: number = 0;
    schcd: string = "";
    schnm: string = "";
    lat: string = "0.00";
    lon: string = "0.00";
    schvehs: number = 0;
    oprvehs: number = 0;
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
    isvalidentt: boolean = true;

    contactDT: any = [];
    duplicateContact: boolean = true;

    boardDT: any = [];
    weekDT: any = [];
    entttypeDT: any = [];

    uploadLogoDT: any = [];
    global = new Globals();
    uploadlogoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _entityservice: EntityService,
        private _autoservice: CommonService, private _loginservice: LoginService, private cdRef: ChangeDetectorRef) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this.getLogoUploadConfig();

        this.fillDropDownList();
        this.fillFieldDropDown();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();

        this.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $(".schcd").focus();
        }, 100);
    }

    hideWhenEntityFields() {
        if (this.entttype == "School") {
            $("#diventtfields").prop("class", "row clearfix show");
        }
        else{
            $("#diventtfields").prop("class", "row clearfix hide");
        }
    }

    // get lat and long by address form google map

    getLatAndLong() {
        var that = this;
        commonfun.loader("#address");

        var geocoder = new google.maps.Geocoder();

        geocoder.geocode({ 'address': that.address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                that.lat = results[0].geometry.location.lat();
                that.lon = results[0].geometry.location.lng();
            }
            else {
                that._msg.Show(messageType.error, "Error", "Couldn't find your Location");
            }

            commonfun.loaderhide("#address");
            that.cdRef.detectChanges();
        });
    }

    // Fill Entity Type, Week DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "dropdown", "wscode": that._wsdetails.wscode }).subscribe(data => {
            try {
                that.entttypeDT = data.data.filter(a => a.group === "workspace");

                if (that.entttypeDT.length == 1) {
                    that.entttype = that.entttypeDT[0].key;
                }
                else {
                    that.entttypeDT.splice(0, 0, { "key": "", "val": "Select Entity Type" });
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

    // Fill Standard And Subject DropDown

    fillFieldDropDown() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "ddlfield" }).subscribe(data => {
            try {
                that.boardDT = data.data.filter(a => a.group === "board");
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

    // Get Valid Entity

    getValidEntity() {
        var that = this;
        var params = {};

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] == undefined) {
                commonfun.loader();

                params = {
                    "flag": "validentt", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
                    "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
                }

                that._entityservice.getEntityDetails(params).subscribe(data => {
                    try {
                        var enttdata = data.data.filter(a => a.entttype === that.entttype);

                        if (enttdata.length > 0) {
                            var countentity = enttdata[0].countentt;
                            var limitentity = that.entttype == "Company" ? that._wsdetails.cmpenttmaxno : that._wsdetails.schenttmaxno;

                            if (limitentity <= countentity) {
                                that.isvalidentt = false;
                                that._msg.Show(messageType.info, "Info", "Only " + limitentity + " " + that.entttype + " Allowed");
                            }
                            else {
                                that.isvalidentt = true;
                            }
                        }
                        else {
                            that.isvalidentt = false;
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
        });
    }

    // Get State DropDown

    fillStateDropDown() {
        var that = this;
        commonfun.loader();

        that._autoservice.getDropDownData({ "flag": "state" }).subscribe(data => {
            try {
                that.stateDT = data.data;
                // setTimeout(function () { $.AdminBSB.select.refresh('state'); }, 100);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('city'); }, 100);
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
                // setTimeout(function () { $.AdminBSB.select.refresh('area'); }, 100);
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

        // Duplicate Contact Check

        that.duplicateContact = that.isDuplicateContact();

        // Add New Row
        if (that.duplicateContact == false) {
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

    // File Upload

    getLogoUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadlogoconfig.server = that.global.serviceurl + "uploads";
            that.uploadlogoconfig.serverpath = that.global.serviceurl;
            that.uploadlogoconfig.uploadurl = that.global.uploadurl;
            that.uploadlogoconfig.filepath = that.global.filepath;
            that.uploadlogoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadlogoconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onLogoUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadLogoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadLogoDT.push({ "athurl": imgfile[i].path.replace(that.uploadlogoconfig.filepath, "") })
            }
        }, 1000);
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

    removeLogoUpload() {
        this.uploadLogoDT.splice(0, 1);
    }

    // Clear Fields

    resetEntityFields() {
        var that = this;

        that.schid = 0;
        that.entttype = "";
        that.schcd = "";
        that.schnm = "";
        that.schvehs = 0;
        that.oprvehs = 0;
        that.remark1 = "";
        that.address = "";
        that.lat = "0.00";
        that.lon = "0.00";

        that.address = that._wsdetails.address;
        that.getLatAndLong();
        that.country = "India";
        that.state = that._wsdetails.sid;
        that.fillCityDropDown();
        that.city = that._wsdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._wsdetails.arid;
        that.pincode = that._wsdetails.pincode;

        that.isactive = true;
        that.mode = "";
        that.chooseLabel = "Upload Logo";

        that.clearcheckboxes();
    }

    private clearcheckboxes(): void {
        $("input[type=checkbox]").prop('checked', false);
    }

    // Setting Standard Checkboxes

    private selectAndDeselectAllCheckboxes() {
        if ($("#selectall").is(':checked')) {
            $(".allcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private selectAndDeselectGroupWiseCheckboxes(row) {
        var key = "std" + row.key.split('~')[0];

        if ($("#" + key).is(':checked')) {
            $("#" + key + " input[type=checkbox]").prop('checked', true);
        }
        else {
            $("#" + key + " input[type=checkbox]").prop('checked', false);
        }
    }

    // Setting Subject Checkboxes

    private selectAndDeselectAllSubCheckboxes() {
        if ($("#selectallsub").is(':checked')) {
            $(".allsubcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allsubcheckboxes input[type=checkbox]").prop('checked', false);
        }
    }

    private selectAndDeselectGroupWiseSubCheckboxes(row) {
        var key = "sub" + row.key;

        if ($("#" + key).is(':checked')) {
            $("#" + key + " input[type=checkbox]").prop('checked', true);
        }
        else {
            $("#" + key + " input[type=checkbox]").prop('checked', false);
        }
    }

    // Setting Board Checkboxes

    private selectAndDeselectAllBoardCheckboxes() {
        if ($("#selectallboard").is(':checked')) {
            $(".allboardcheckboxes input[type=checkbox]").prop('checked', true);
        }
        else {
            $(".allboardcheckboxes input[type=checkbox]").prop('checked', false);
        }
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

    // Save Entity Data

    isValidationEntity() {
        var that = this;

        if (that.entttype == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.entttype + " Type");
            $(".entttype").focus();
            return false;
        }
        else if (that.schcd == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.entttype + " Code");
            $(".schcd").focus();
            return false;
        }
        else if (that.schnm == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.entttype + " Name");
            $(".schnm").focus();
            return false;
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }
        else if (that.lat == "") {
            that._msg.Show(messageType.error, "Error", "Enter Late");
            $(".lat").focus();
            return false;
        }
        else if (that.lon == "") {
            that._msg.Show(messageType.error, "Error", "Enter Lon");
            $(".lon").focus();
            return false;
        }
        else if (that.state == 0) {
            that._msg.Show(messageType.error, "Error", "Select State");
            $(".state").focus();
            return false;
        }
        else if (that.city == 0) {
            that._msg.Show(messageType.error, "Error", "Select City");
            $(".city").focus();
            return false;
        }

        return true;
    }

    saveEntityInfo() {
        var that = this;
        var isvalid = that.isValidationEntity();

        if (isvalid) {
            var mweek = null;
            var wkrights = "";
            var weeklyoff = "";

            var boarditem = null;
            var boardrights = "";
            var board = "";

            $("#week").find("input[type=checkbox]").each(function () {
                wkrights += (this.checked ? $(this).val() + "," : "");
            });

            weeklyoff = "{" + wkrights.slice(0, -1) + "}";

            // Board

            for (var i = 0; i <= that.boardDT.length - 1; i++) {
                boarditem = null;
                boarditem = that.boardDT[i];

                if (boarditem !== null) {
                    $("#boarditem" + boarditem.key).find("input[type=checkbox]").each(function () {
                        boardrights += (this.checked ? $(this).val() + "," : "");
                    });
                }
            }

            board = "{" + boardrights.slice(0, -1) + "}";

            if (weeklyoff == '{}') {
                that._msg.Show(messageType.error, "Error", "Atleast select 1 Week Days");
            }
            else if (that.entttype == "School" && board == '{}') {
                that._msg.Show(messageType.error, "Error", "Atleast select 1 Board");
            }
            else {
                commonfun.loader();

                var saveentity = {
                    "autoid": that.schid,
                    "entttype": that.entttype,
                    "schcd": that.schcd,
                    "schnm": that.schnm,
                    "schlogo": that.uploadLogoDT.length == 0 ? "" : that.uploadLogoDT[0].athurl,
                    "schgeoloc": (that.lat == "" ? "0.00" : that.lat) + "," + (that.lon == "" ? "0.00" : that.lon),
                    "schvehs": that.schvehs.toString() == "" ? 0 : that.schvehs,
                    "oprvehs": that.oprvehs.toString() == "" ? 0 : that.oprvehs,
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
                    "weeklyoff": weeklyoff,
                    "board": board,
                    "remark1": that.remark1,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._wsdetails.wsautoid,
                    "isactive": that.isactive,
                    "mode": ""
                }

                that._entityservice.saveEntityInfo(saveentity).subscribe(data => {
                    try {
                        var dataResult = data.data;
                        var msg = dataResult[0].funsave_schoolinfo.msg;
                        var msgid = dataResult[0].funsave_schoolinfo.msgid;

                        if (msgid != "-1") {
                            that._msg.Show(messageType.success, "Success", msg);

                            if (msgid === "1") {
                                that.resetEntityFields();
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

    // Get Entity Data

    getEntityDetails() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.schid = params['id'];

                that._entityservice.getEntityDetails({
                    "flag": "edit",
                    "id": that.schid,
                    "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.schid = data.data[0].autoid;
                            that.entttype = data.data[0].entttype;
                            that.schcd = data.data[0].schoolcode;
                            that.schnm = data.data[0].schoolname;

                            if (data.data[0].schlogo !== "") {
                                that.uploadLogoDT.push({ "athurl": data.data[0].schlogo });
                                that.chooseLabel = "Change Logo";
                            }
                            else {
                                that.uploadLogoDT = [];
                                that.chooseLabel = "Upload Logo";
                            }

                            that.lat = data.data[0].lat;
                            that.lon = data.data[0].lon;
                            that.schvehs = data.data[0].ownbuses;
                            that.oprvehs = data.data[0].vanoperator;

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

                            var weeklyoff = data.data[0].weeklyoff;

                            if (weeklyoff != null) {
                                for (var i = 0; i < weeklyoff.length; i++) {
                                    $("#week").find("#" + weeklyoff[i]).prop('checked', true);
                                }
                            }

                            if (that.entttype == "School") {
                                var _boardrights = null;
                                var _boardids = null;

                                _boardrights = null;
                                _boardrights = data.data[0].board;

                                if (_boardrights != null) {
                                    for (var i = 0; i < _boardrights.length; i++) {
                                        _boardids = null;
                                        _boardids = _boardrights[i];

                                        if (_boardids != null) {
                                            $("#board" + _boardids).prop('checked', true);
                                            $(".allboardcheckboxes").find("#board" + _boardids).prop('checked', true);
                                        }
                                        else {
                                            $(".allboardcheckboxes").find("#board" + _boardids).prop('checked', false);
                                        }
                                    }
                                }
                                else {
                                    $(".allboardcheckboxes").find("#board" + _boardids).prop('checked', false);
                                }
                            }

                            that.remark1 = data.data[0].remark1;
                            that.isactive = data.data[0].isactive;
                            that.mode = data.data[0].mode;
                        }
                        else {
                            that.resetEntityFields();
                        }
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                }, () => {

                })
            }
            else {
                that.getValidEntity();
                that.resetEntityFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/workspace/entity']);
    }
}
