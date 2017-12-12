import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';
import { debounce } from 'rxjs/operator/debounce';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addadmsn.comp.html',
    providers: [CommonService]
})

export class AddAdmissionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    prospectusDT: any = [];
    prspctnoDT: any = [];

    ayDT: any = [];
    classDT: any = [];
    boardDT: any = [];
    genderDT: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    qualificationDT: any = [];
    fthrocptnDT: any = [];
    mthrocptnDT: any = [];

    studentDT: any = [];
    parentDT: any = [];
    siblingDT: any = [];
    selectedSibling: any = [];
    iseditsibling: boolean = false;

    isprspct: boolean = false;
    prspctid: number = 0;
    prspctno: number = 0;

    paramsid: number = 0;
    enrlmntid: number = 0;
    autoid: number = 0;
    fname: string = "";
    mname: string = "";
    lname: string = "";
    ayid: number = 0;
    classid: number = 0;
    rollno: number = 0;
    boardid: number = 0;
    gender: string = "";
    dob: any = "";
    birthplace: string = "";

    address: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;

    otherinfo: string = "";
    remark1: string = "";

    // Sibling

    sibfmlid: number = 0;
    sibrelation: string = "";
    sibfullname: string = "";
    sibage: string = "";
    sibclassid: number = 0;
    sibschid: number = 0;
    sibothschname: string = "";
    sibenrlmntid: number = 0;
    sibisactive: boolean = false;

    // Parents - Father

    fthrloginid: number = 0;
    fthrfmlid: number = 0;
    fthrcode: string = "";
    fthrname: string = "";
    fthrmobile: string = "";
    fthremail: string = "";
    fthrqlfid: number = 0;
    fthrocptn: string = "";
    fthrsalary: any = "";
    fthrschid: number = 0;
    fthrothschname: string = "";
    fthrenrlmntid: number = 0;

    // Parents - Mother

    mthrloginid: number = 0;
    mthrfmlid: number = 0;
    mthrcode: string = "";
    mthrname: string = "";
    mthrmobile: string = "";
    mthremail: string = "";
    mthrqlfid: number = 0;
    mthrocptn: string = "";
    mthrsalary: any = "";
    mthrschid: number = 0;
    mthrothschname: string = "";
    mthrenrlmntid: number = 0;

    global = new Globals();

    // Upload Photo

    uploadPhotoDT: any = [];
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    // Upload DOB Certificate

    uploadDOBCertificate: any = [];
    uploaddobconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseDOBLabel: string = "";

    // Upload Address Proof

    uploadAddrProof: any = [];
    uploadaddrconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseAddrLabel: string = "";

    mode: string = "";
    isactive: boolean = true;

    private subscribeParameters: any;

    constructor(private _admsnservice: AdmissionService, private _autoservice: CommonService, private _routeParams: ActivatedRoute,
        private _loginservice: LoginService, private _router: Router, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillQualificationDropDown();
        this.getUploadConfig();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 1000);

        this.getAdmissionDetails();
    }

    isWithProspectus() {
        var that = this;

        if (that.isprspct) {
            $('#prspctid').prop('disabled', false);
            $('#prspctno').prop('disabled', false);
        }
        else {
            $('#prspctid').prop('disabled', true);
            $('#prspctno').prop('disabled', true);
        }
    }

    // Fill Academic Year, Class And Occupation DropDown

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.prospectusDT = data.data.filter(a => a.group == "prospectus");
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].key;
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.boardDT = data.data.filter(a => a.group == "board");
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.fthrocptnDT = data.data.filter(a => a.group == "occupation").filter(a => a.key != "housewife");
                that.mthrocptnDT = data.data.filter(a => a.group == "occupation");
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

    // Get Form No

    getFormNo() {
        var that = this;
        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "prspctno", "prspctid": that.prspctid, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.prspctnoDT = data.data;
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

    // Get Qualification DropDown

    fillQualificationDropDown() {
        var that = this;
        commonfun.loader();

        that._admsnservice.getStudentDetails({ "flag": "qualification" }).subscribe(data => {
            try {
                that.qualificationDT = data.data;
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

    // Upload

    getUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadphotoconfig.server = that.global.serviceurl + "uploads";
            that.uploadphotoconfig.serverpath = that.global.serviceurl;
            that.uploadphotoconfig.uploadurl = that.global.uploadurl;
            that.uploadphotoconfig.filepath = that.global.filepath;
            that.uploadphotoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadphotoconfig.acceptedFiles = data.data[0]._filetype;

            that.uploaddobconfig.server = that.global.serviceurl + "uploads";
            that.uploaddobconfig.serverpath = that.global.serviceurl;
            that.uploaddobconfig.uploadurl = that.global.uploadurl;
            that.uploaddobconfig.filepath = that.global.filepath;
            that.uploaddobconfig.maxFilesize = data.data[0]._filesize;
            that.uploaddobconfig.acceptedFiles = data.data[0]._filetype;

            that.uploadaddrconfig.server = that.global.serviceurl + "uploads";
            that.uploadaddrconfig.serverpath = that.global.serviceurl;
            that.uploadaddrconfig.uploadurl = that.global.uploadurl;
            that.uploadaddrconfig.filepath = that.global.filepath;
            that.uploadaddrconfig.maxFilesize = data.data[0]._filesize;
            that.uploadaddrconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    // Photo Upload

    onPhotoUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadPhotoDT = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, "") })
            }
        }, 1000);
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Birth Certificate Upload

    onDOBUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadDOBCertificate = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadDOBCertificate.push({ "athurl": imgfile[i].path.replace(that.uploaddobconfig.filepath, "") })
            }
        }, 1000);
    }

    removeDOBUpload() {
        this.uploadDOBCertificate.splice(0, 1);
    }

    // Address Proof Upload

    onAddressUpload(event) {
        var that = this;
        var imgfile = [];
        that.uploadAddrProof = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.uploadAddrProof.push({ "athurl": imgfile[i].path.replace(that.uploadaddrconfig.filepath, "") })
            }
        }, 1000);
    }

    removeAddressUpload() {
        this.uploadAddrProof.splice(0, 1);
    }

    isDuplicateSibling() {
        var that = this;
        var sibfields = null;

        for (var i = 0; i < that.siblingDT.length; i++) {
            sibfields = that.siblingDT[i];

            if ((sibfields.relation == that.sibrelation) && (sibfields.fullname == that.sibfullname)
                && (sibfields.age == that.sibage) && (sibfields.classid == that.classid)) {
                return true;
            }
        }

        return false;
    }

    // Sibling Validation

    isSiblingValidation() {
        var that = this;

        if (that.sibrelation == "") {
            that._msg.Show(messageType.error, "Error", "Select Relation");
            return false;
        }
        else if (that.sibfullname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Full Name");
            return false;
        }
        else if (that.sibage == "") {
            that._msg.Show(messageType.error, "Error", "Enter Age");
            return false;
        }
        else if (that.sibclassid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class Name");
            return false;
        }

        return true;
    }

    // Add Sibling Data

    addSibling() {
        var that = this;
        var isdupsib = that.isDuplicateSibling();
        var isvalidsib = that.isSiblingValidation();

        if (isdupsib) {
            that._msg.Show(messageType.error, "Error", "Duplicate Sibling Not Found");
        }
        else {
            if (isvalidsib) {
                that.siblingDT.push({
                    "fmlid": that.sibfmlid, "relation": that.sibrelation, "relname": $(".sibrelation option:selected").text().trim(),
                    "fullname": that.sibfullname, "age": that.sibage,
                    "classid": that.sibclassid, "classname": $(".sibclassname option:selected").text().trim(),
                    "schid": that.sibschid, "schname": $(".sibschname option:selected").text().trim(),
                    "enrlmntid": that.sibschid == 0 ? 0 : that.enrlmntid, "othschname": that.sibothschname,
                    "fmltyp": "sibling", "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode,
                    "isactive": true
                })

                that.resetSibling();
            }
        }
    }

    // Edit Sub Heading

    editSibling(row) {
        var that = this;

        that.selectedSibling = row;
        that.sibrelation = row.relation;
        that.sibfullname = row.sibfullname;
        that.sibage = row.sibage;
        that.sibclassid = row.sibclassid;
        that.sibschid = row.sibschid;
        that.sibothschname = row.sibothschname;
        that.sibenrlmntid = row.sibenrlmntid;

        that.iseditsibling = true;
    }

    // Delete Sibling

    deleteSibling(row) {
        row.isactive = false;
    }

    // Update Sibling

    updateSibling() {
        var that = this;

        that.selectedSibling.relation = that.sibrelation;
        that.selectedSibling.sibfullname = that.sibfullname;
        that.selectedSibling.sibage = that.sibage;
        that.selectedSibling.sibclassid = that.sibclassid;
        that.selectedSibling.sibschid = that.sibschid;
        that.selectedSibling.sibothschname = that.sibothschname;
        that.selectedSibling.sibenrlmntid = that.sibenrlmntid;
        that.iseditsibling = false;

        that.resetSibling();
    }

    // Reset Sibling

    resetSibling() {
        var that = this;

        that.sibrelation = "";
        that.sibfullname = "";
        that.sibage = "";
        that.sibclassid = 0;
        that.sibschid = 0;
        that.sibothschname = "";
        that.sibenrlmntid = 0;
    }

    // Get Admission Data

    resetFatherFields() {
        var that = this;

        that.fthrloginid = 0;
        that.fthrfmlid = 0;
        that.fthrcode = "";
        that.fthrname = "";
        that.fthrmobile = "";
        that.fthremail = "";
        that.fthrschid = 0;
        that.fthrenrlmntid = 0;
        that.fthrothschname = "";
        that.fthrqlfid = 0;
        that.fthrocptn = "";
        that.fthrsalary = "";
    }

    resetMotherFields() {
        var that = this;

        that.mthrloginid = 0;
        that.mthrfmlid = 0;
        that.mthrcode = "";
        that.mthrname = "";
        that.mthrmobile = "";
        that.mthremail = "";
        that.mthrschid = 0;
        that.mthrenrlmntid = 0;
        that.mthrothschname = "";
        that.mthrqlfid = 0;
        that.mthrocptn = "";
        that.mthrsalary = "";
    }

    getParentAndSibling(_mobile) {
        var that = this;

        var _mthrfld: any = [];
        var _fthrfld: any = [];

        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "parents",
            "mobile": _mobile,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.parentDT = data.data.filter(a => a.fmltyp == "parent");
                that.siblingDT = data.data.filter(a => a.fmltyp == "sibling");

                if (that.parentDT.length != 0) {
                    _fthrfld = that.parentDT.filter(a => a.relation == "father");
                    _mthrfld = that.parentDT.filter(a => a.relation == "mother");

                    if (_fthrfld.length != 0) {
                        that.fthrloginid = _fthrfld[0].loginid;
                        that.fthrfmlid = _fthrfld[0].fmlid;
                        that.fthrcode = _fthrfld[0].fmlcode;
                        that.fthrname = _fthrfld[0].fullname;
                        that.fthrmobile = _fthrfld[0].mobile;
                        that.fthremail = _fthrfld[0].email;
                        that.fthrschid = _fthrfld[0].schid;
                        that.fthrenrlmntid = _fthrfld[0].enrlmntid;
                        that.fthrothschname = _fthrfld[0].othschname;
                        that.fthrqlfid = _fthrfld[0].qlfid;
                        that.fthrocptn = _fthrfld[0].occupation;
                        that.fthrsalary = _fthrfld[0].salary;
                    }
                    else {
                        that.resetFatherFields();
                    }

                    if (_mthrfld.length != 0) {
                        that.mthrloginid = _mthrfld[0].loginid;
                        that.mthrfmlid = _mthrfld[0].fmlid;
                        that.mthrcode = _mthrfld[0].fmlcode;
                        that.mthrname = _mthrfld[0].fullname;
                        that.mthrmobile = _mthrfld[0].mobile;
                        that.mthremail = _mthrfld[0].email;
                        that.mthrschid = _mthrfld[0].schid;
                        that.mthrenrlmntid = _mthrfld[0].enrlmntid;
                        that.mthrothschname = _mthrfld[0].othschname;
                        that.mthrqlfid = _mthrfld[0].qlfid;
                        that.mthrocptn = _mthrfld[0].occupation;
                        that.mthrsalary = _mthrfld[0].salary;
                    }
                    else {
                        that.resetMotherFields();
                    }
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

    // Save Data

    isValidAdmission() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.fname == "") {
            that._msg.Show(messageType.error, "Error", "Enter First Name");
            $(".fname").focus();
            return false;
        }
        else if (that.lname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
            return false;
        }
        else if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }
        else if (that.rollno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Roll No");
            $(".rollno").focus();
            return false;
        }
        else if (that.boardid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Board");
            $(".boardname").focus();
            return false;
        }
        else if (that.gender == "") {
            that._msg.Show(messageType.error, "Error", "Select Gender");
            $(".gender").focus();
            return false;
        }
        else if (that.dob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date Of Birth");
            $(".dob").focus();
            return false;
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
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
        else if (that.fthrmobile == "" && that.mthrmobile == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Mobile No / Mother Mobile No");
            $(".fthrmobile").focus();
            return false;
        }
        else if (that.fthrcode == "" && that.mthrcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Code / Mother Code");
            $(".fthrcode").focus();
            return false;
        }
        else if (that.fthrcode == that.mthrcode) {
            that._msg.Show(messageType.error, "Error", "Father Code and Mother Code Not Same");
            $(".fthrcode").focus();
            return false;
        }
        else if (that.fthrname == "" && that.mthrname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Name / Mother Name");
            $(".fthrname").focus();
            return false;
        }
        else if (that.fthremail == "" && that.mthremail == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Email / Mother Email");
            $(".fthremail").focus();
            return false;
        }

        return true;
    }

    saveAdmissionInfo() {
        var that = this;
        var isvalid: boolean = false;
        var parentDT: any = [];

        isvalid = that.isValidAdmission();

        if (isvalid) {
            commonfun.loader();

            var saveAdmission = {
                // Student

                "prspctid": that.prspctid,
                "prspctno": that.prspctno,

                "enrlmntid": that.enrlmntid,
                "autoid": that.autoid,
                "fname": that.fname,
                "mname": that.mname,
                "lname": that.lname,
                "ayid": that.ayid,
                "enttid": that._enttdetails.enttid,
                "classid": that.classid,
                "rollno": that.rollno,
                "boardid": that.boardid,
                "gender": that.gender,
                "dob": that.dob,
                "birthplace": that.birthplace,
                "otherinfo": that.otherinfo,
                "remark1": that.remark1,

                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
                "birthcrfct": that.uploadDOBCertificate.length > 0 ? that.uploadDOBCertificate[0].athurl : "",
                "addrproof": that.uploadAddrProof.length > 0 ? that.uploadAddrProof[0].athurl : "",

                "address": that.address,
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode.toString() == "" ? 0 : that.pincode,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._enttdetails.wsautoid,
                "isactive": that.isactive,

                // Father

                "fthrloginid": that.fthrloginid,
                "fthrfmlid": that.fthrfmlid,
                "fthrmobile": that.fthrmobile,
                "fthrcode": that.fthrcode,
                "fthrfullname": that.fthrname,
                "fthremail": that.fthremail,
                "fthrschid": that.fthrschid,
                "fthrenrlmntid": that.fthrschid == 0 ? 0 : that.fthrenrlmntid,
                "fthrothschname": that.fthrothschname,
                "fthrqlfid": that.fthrqlfid,
                "fthrocptn": that.fthrocptn,
                "fthrsalary": that.fthrsalary == "" ? "0" : that.fthrsalary,
                "fthrcuid": that.loginUser.ucode,

                // Mother

                "mthrloginid": that.mthrloginid,
                "mthrfmlid": that.mthrfmlid,
                "mthrmobile": that.mthrmobile,
                "mthrcode": that.mthrcode,
                "mthrfullname": that.mthrname,
                "mthremail": that.mthremail,
                "mthrschid": that.mthrschid,
                "mthrenrlmntid": that.mthrschid == 0 ? 0 : that.mthrenrlmntid,
                "mthrothschname": that.mthrothschname,
                "mthrqlfid": that.mthrqlfid,
                "mthrocptn": that.mthrocptn,
                "mthrsalary": that.mthrsalary == "" ? "0" : that.mthrsalary,
                "mthrcuid": that.loginUser.ucode,

                // Sibling

                "studentsibling": that.siblingDT
            }

            that._admsnservice.saveAdmissionInfo(saveAdmission).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_admissioninfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var enrlmntid = dataResult.enrlmntid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.prspctno = 0;

                            that.resetStudentFields();
                            that.resetParentFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide();
            }, err => {
                console.log(err);
                that._msg.Show(messageType.error, "Error", err);

                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Reset Fields

    resetStudentFields() {
        var that = this;

        if (that.prspctid != 0 && that.prspctno != 0) {
            that._admsnservice.viewStudentDetails({
                "flag": "addadmsn", "prspctid": that.prspctid, "prspctno": that.prspctno, "wsautoid": that._enttdetails.wsautoid
            }).subscribe(data => {
                try {
                    that.studentDT = data.data[0];

                    if (that.studentDT.length != 0) {
                        that.fname = that.studentDT[0].fname;
                        that.mname = that.studentDT[0].mname;
                        that.lname = that.studentDT[0].lname;
                        that.ayid = that.studentDT[0].ayid;
                        that.classid = that.studentDT[0].classid;
                        that.boardid = that.studentDT[0].boardid;
                        that.gender = that.studentDT[0].gender;
                    }
                    else {
                        that.fname = "";
                        that.mname = "";
                        that.lname = "";
                        that.ayid = 0;
                        that.classid = 0;
                        that.boardid = 0;
                        that.gender = "";
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
        else {
            that.fname = "";
            that.mname = "";
            that.lname = "";
            that.ayid = 0;
            that.classid = 0;
            that.boardid = 0;
            that.gender = "";
        }

        that.enrlmntid = 0;
        that.rollno = 0;

        that.dob = "";
        that.birthplace = "";
        that.otherinfo = "";
        that.remark1 = "";

        that.address = that._enttdetails.address;
        that.country = that._enttdetails.country;
        that.state = that._enttdetails.sid;
        that.fillCityDropDown();
        that.city = that._enttdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._enttdetails.arid;
        that.pincode = that._enttdetails.pincode;

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Student Photo";

        that.uploadDOBCertificate = [];
        that.chooseDOBLabel = "Upload Birth Certificate";

        that.uploadAddrProof = [];
        that.chooseAddrLabel = "Upload Address Proof";
    }

    resetParentFields() {
        var that = this;

        if (that.prspctid != 0 && that.prspctno != 0) {
            that._admsnservice.viewStudentDetails({
                "flag": "addadmsn", "prspctid": that.prspctid, "prspctno": that.prspctno, "wsautoid": that._enttdetails.wsautoid
            }).subscribe(data => {
                try {
                    that.parentDT = data.data[1];

                    if (that.parentDT.length != 0) {
                        that.fthrfmlid = 0;
                        that.fthrname = that.parentDT[0].prnttyp == "father" ? that.parentDT[0].prntname : "";
                        that.fthrmobile = that.parentDT[0].prnttyp == "father" ? that.parentDT[0].prntmob : "";

                        that.mthrfmlid = 0;
                        that.mthrname = that.parentDT[0].prnttyp == "mother" ? that.parentDT[0].prntname : "";
                        that.mthrmobile = that.parentDT[0].prnttyp == "mother" ? that.parentDT[0].prntmob : "";

                        that.getParentAndSibling(that.parentDT[0].prntmob);
                    }
                    else {
                        that.fthrfmlid = 0;
                        that.fthrname = "";
                        that.fthrmobile = "";

                        that.mthrfmlid = 0;
                        that.mthrname = "";
                        that.mthrmobile = "";
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
        else {
            that.fthrfmlid = 0;
            that.fthrname = "";
            that.fthrmobile = "";

            that.mthrfmlid = 0;
            that.mthrname = "";
            that.mthrmobile = "";
        }

        that.fthremail = "";
        that.fthrschid = 0;
        that.fthrothschname = "";
        that.fthrenrlmntid = 0;
        that.fthrqlfid = 0;
        that.fthrocptn = "";
        that.fthrsalary = "";

        that.mthremail = "";
        that.mthrschid = 0;
        that.mthrothschname = "";
        that.mthrenrlmntid = 0;
        that.mthrqlfid = 0;
        that.mthrocptn = "";
        that.mthrsalary = "";
    }

    // Get Admission Data

    getAdmissionDetails() {
        var that = this;

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];
                that.getStudentDetails();
                $('#prspctid').prop('disabled', true);
                $('#prspctno').prop('disabled', true);
            }
            else {
                that.resetStudentFields();
                $('#prspctid').prop('disabled', false);
                $('#prspctno').prop('disabled', false);
            }
        });
    }

    getStudentDetails() {
        var that = this;
        var _mthrfld = null;
        var _fthrfld = null;

        commonfun.loader();

        that._admsnservice.viewStudentDetails({
            "flag": "editadmsn", "id": that.paramsid, "prspctid": that.prspctid, "prspctno": that.prspctno,
            "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.studentDT = data.data[0];
                that.parentDT = data.data[1].filter(a => a.fmltyp == "parent");
                that.siblingDT = data.data[1].filter(a => a.fmltyp == "sibling");

                if (that.studentDT.length != 0) {
                    if (that.paramsid == 0) {
                        // that.prspctid = 0;
                        // that.prspctno = 0;
                    }
                    else {
                        that.prspctid = that.studentDT[0].prspctid;
                        that.getFormNo();
                        that.prspctno = that.studentDT[0].prspctno;
                    }

                    that.enrlmntid = that.studentDT[0].enrlmntid;
                    that.autoid = that.studentDT[0].autoid;
                    that.fname = that.studentDT[0].fname;
                    that.mname = that.studentDT[0].mname;
                    that.lname = that.studentDT[0].lname;
                    that.ayid = that.studentDT[0].ayid;
                    that.classid = that.studentDT[0].classid;
                    that.rollno = that.studentDT[0].rollno;
                    that.boardid = that.studentDT[0].boardid;
                    that.gender = that.studentDT[0].gender;
                    that.dob = that.studentDT[0].dob;
                    that.birthplace = that.studentDT[0].birthplace;
                    that.otherinfo = that.studentDT[0].otherinfo;
                    that.remark1 = that.studentDT[0].remark1;

                    that.address = that.studentDT[0].address;
                    that.country = that.studentDT[0].country;
                    that.state = that.studentDT[0].state;
                    that.fillCityDropDown();
                    that.city = that.studentDT[0].city;
                    that.fillAreaDropDown();
                    that.area = that.studentDT[0].area;
                    that.pincode = that.studentDT[0].pincode;
                    that.isactive = that.studentDT[0].isactive;
                    that.mode = that.studentDT[0].mode;

                    var filepath = that.studentDT[0].FilePath;
                    var birthcrtfct = that.studentDT[0].birthcrtfct;
                    var addrproof = that.studentDT[0].addrproof;

                    if (filepath != "" && filepath != null) {
                        that.uploadPhotoDT.push({ "athurl": filepath });
                        that.chooseLabel = "Change Student Photo";
                    }
                    else {
                        that.uploadPhotoDT = [];
                        that.chooseLabel = "Upload Student Photo";
                    }

                    if (birthcrtfct != "" && birthcrtfct != null) {
                        that.uploadDOBCertificate.push({ "athurl": birthcrtfct });
                        that.chooseDOBLabel = "Change Birth Certificate";
                    }
                    else {
                        that.uploadDOBCertificate = [];
                        that.chooseDOBLabel = "Upload Birth Certificate";
                    }

                    if (addrproof != "" && addrproof != null) {
                        that.uploadAddrProof.push({ "athurl": addrproof });
                        that.chooseAddrLabel = "Change Address Proof";
                    }
                    else {
                        that.uploadAddrProof = [];
                        that.chooseAddrLabel = "Upload Address Proof";
                    }
                }
                else {
                    that.resetStudentFields();
                }

                if (that.parentDT.length != 0) {
                    _fthrfld = that.parentDT.filter(a => a.relation == "father");
                    _mthrfld = that.parentDT.filter(a => a.relation == "mother");

                    if (_fthrfld.length != 0) {
                        that.fthrloginid = _fthrfld[0].loginid;
                        that.fthrfmlid = _fthrfld[0].fmlid;
                        that.fthrcode = _fthrfld[0].fmlcode;
                        that.fthrname = _fthrfld[0].fullname;
                        that.fthrmobile = _fthrfld[0].mobile;
                        that.fthremail = _fthrfld[0].email;
                        that.fthrschid = _fthrfld[0].schid;
                        that.fthrenrlmntid = _fthrfld[0].enrlmntid;
                        that.fthrothschname = _fthrfld[0].othschname;
                        that.fthrqlfid = _fthrfld[0].qlfid;
                        that.fthrocptn = _fthrfld[0].occupation;
                        that.fthrsalary = _fthrfld[0].salary;
                    }
                    else {
                        that.resetFatherFields();
                    }

                    if (_mthrfld.length != 0) {
                        that.mthrloginid = _mthrfld[0].loginid;
                        that.mthrfmlid = _mthrfld[0].fmlid;
                        that.mthrcode = _mthrfld[0].fmlcode;
                        that.mthrname = _mthrfld[0].fullname;
                        that.mthrmobile = _mthrfld[0].mobile;
                        that.mthremail = _mthrfld[0].email;
                        that.mthrschid = _mthrfld[0].schid;
                        that.mthrenrlmntid = _mthrfld[0].enrlmntid;
                        that.mthrothschname = _mthrfld[0].othschname;
                        that.mthrqlfid = _mthrfld[0].qlfid;
                        that.mthrocptn = _mthrfld[0].occupation;
                        that.mthrsalary = _mthrfld[0].salary;
                    }
                    else {
                        that.resetMotherFields();
                    }
                }
                else {
                    that.resetParentFields();
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/student']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
