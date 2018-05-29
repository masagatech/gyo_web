import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

declare var google: any;
declare var loader: any;
declare var adminloader: any;

@Component({
    templateUrl: 'addadmsn.comp.html'
})

export class AddAdmissionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    prospectusDT: any = [];
    prspctnoDT: any = [];
    boardDT: any = [];

    ayDT: any = [];
    classDT: any = [];
    genderDT: any = [];
    socialCategoryDT: any = [];
    docTypeDT: any = [];

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

    paramsid: number = 0;
    enrlmntid: number = 0;
    autoid: number = 0;

    isprspct: boolean = false;
    prspctid: number = 0;
    prspctname: string = "";
    prspctno: number = 0;
    boardid: number = 0;
    boardname: string = "";

    cuid: number = 0;
    grno: number = 0;
    ayid: number = 0;
    ayname: string = "";
    classid: number = 0;
    classname: string = "";
    rollno: number = 0;
    fname: string = "";
    mname: string = "";
    lname: string = "";
    aadharno: number = 0;
    soccatid: number = 0;
    soccatname: string = "";
    gndrkey: string = "M";
    gndrval: string = "";
    dob: any = "";
    birthplace: string = "";
    saveSiblingDT: string = "[]";

    address: string = "";
    country: string = "India";
    state: number = 0;
    stname: string = "";
    city: number = 0;
    ctname: string = "";
    area: number = 0;
    arname: string = "";
    pincode: number = 0;
    otherinfo: string = "";

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
    fthrqlfname: string = "";
    fthrocptn: string = "";
    fthrocptnname: string = "";
    fthrsalary: any = "";
    fthrschid: number = 0;
    fthrschname: string = "";
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
    mthrqlfname: string = "";
    mthrocptn: string = "";
    mthrocptnname: string = "";
    mthrsalary: any = "";
    mthrschid: number = 0;
    mthrschname: string = "";
    mthrothschname: string = "";
    mthrenrlmntid: number = 0;

    // Upload Photo

    uploadPhotoDT: any = [];
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    // Upload DOB Certificate

    birthcrtfctDT: any = [];
    saveBirthCrtfctDT: string = "[]";
    uploaddobconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseDOBLabel: string = "";

    // Upload Address Proof

    addrproofDT: any = [];
    saveAddrProofDT: string = "[]";
    uploadaddrconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseAddrLabel: string = "";

    // Upload Other Document

    documentDT: any = [];
    saveDocumentDT: string = "[]";
    doctypeid: number = 0;
    docfilename: string = "";
    doctype: string = "";
    uploaddocconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    mode: string = "";
    isactive: boolean = true;

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    studentData: any = {};
    oldStudentData: any = [];
    newStudentData: any = [];

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _admsnservice: AdmissionService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillQualificationDropDown();
        this.getUploadConfig();

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;
    }

    public ngOnInit() {
        if (this.isdetails) {
            $('.form-control').prop("disabled", true);
            $('.prospectus').addClass("hide");
            $('.profile-photo').prop("class", "hide");
            $('.profile-dob').prop("class", "hide");
            $('.profile-addr').prop("class", "hide");
        }
        else {
            $('.form-control').prop("disabled", false);
            $('.prospectus').addClass("show");
            $('.profile-photo').prop("class", "show");
            $('.profile-dob').prop("class", "show");
            $('.profile-addr').prop("class", "show");
        }

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
            $('#prspctid').prop("disabled", false);
            $('#prspctno').prop("disabled", false);
        }
        else {
            $('#prspctid').prop("disabled", true);
            $('#prspctno').prop("disabled", true);
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
                that.boardDT = data.data.filter(a => a.group == "board");

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
                that.genderDT = data.data.filter(a => a.group == "gender");
                that.socialCategoryDT = data.data.filter(a => a.group == "socialcategory");
                that.docTypeDT = data.data.filter(a => a.group == "doctype");
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

            that.uploaddocconfig.server = that.global.serviceurl + "uploads";
            that.uploaddocconfig.serverpath = that.global.serviceurl;
            that.uploaddocconfig.uploadurl = that.global.uploadurl;
            that.uploaddocconfig.filepath = that.global.filepath;
            that.uploaddocconfig.maxFilesize = data.data[0]._filesize;
            that.uploaddocconfig.acceptedFiles = data.data[0]._filetype;
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

        for (var i = 0; i < imgfile.length; i++) {
            that.uploadPhotoDT.push({ "athurl": imgfile[i].path.replace(that.uploadphotoconfig.filepath, ""), "athtype": imgfile[i].type })
        }
    }

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Birth Certificate Upload

    onDOBUpload(event) {
        var that = this;
        var imgfile = [];
        that.birthcrtfctDT = [];

        imgfile = JSON.parse(event.xhr.response);

        for (var i = 0; i < imgfile.length; i++) {
            that.birthcrtfctDT.push({ "athurl": imgfile[i].path.replace(that.uploaddobconfig.filepath, ""), "athtype": imgfile[i].type })
        }
    }

    removeDOBUpload() {
        this.birthcrtfctDT.splice(0, 1);
    }

    // Address Proof Upload

    onAddressUpload(event) {
        var that = this;
        var imgfile = [];
        that.addrproofDT = [];

        imgfile = JSON.parse(event.xhr.response);

        for (var i = 0; i < imgfile.length; i++) {
            that.addrproofDT.push({ "athurl": imgfile[i].path.replace(that.uploadaddrconfig.filepath, ""), "athtype": imgfile[i].type })
        }
    }

    removeAddressUpload() {
        this.addrproofDT.splice(0, 1);
    }

    // Other Document Upload

    onDocumentUpload(event) {
        var that = this;
        var imgfile = [];

        imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            for (var i = 0; i < imgfile.length; i++) {
                that.docfilename = imgfile[i].path.replace(that.uploaddocconfig.filepath, "");
                that.doctype = imgfile[i].type;
            }
        }, 1000);
    }

    // Upload Other Document

    addDocumentFile() {
        var that = this;

        if (that.doctypeid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Document Type");
        }
        else if (that.docfilename == "") {
            that._msg.Show(messageType.error, "Error", "Upload Document");
        }
        else {
            var doctypename = $("#doctype option:selected").text().trim();
            that.documentDT.push({ "doctypeid": that.doctypeid, "doctypename": doctypename, "docfilename": that.docfilename, "doctype": that.doctype });

            that.doctypeid = 0;
            that.docfilename = "";
            that.doctype = "";
        }
    }

    removeDocumentFile() {
        this.documentDT.splice(0, 1);
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

    getParentAndSibling(_mobile, _type) {
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
                    if (_type == "father") {
                        _fthrfld = that.parentDT.filter(a => a.relation == "father");

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
                    }

                    if (_type == "mother") {
                        _mthrfld = that.parentDT.filter(a => a.relation == "mother");

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

    isValidAdmission(newval) {
        var that = this;

        if (that.boardid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Board");
            $(".boardname").focus();
            return false;
        }
        if (that.cuid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Child User ID");
            $(".cuid").focus();
            return false;
        }
        if (that.grno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter GR No");
            $(".grno").focus();
            return false;
        }
        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }
        if (that.rollno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Roll No");
            $(".rollno").focus();
            return false;
        }
        if (that.fname == "") {
            that._msg.Show(messageType.error, "Error", "Enter First Name");
            $(".fname").focus();
            return false;
        }
        if (that.lname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
            return false;
        }
        if (that.gndrkey == "") {
            that._msg.Show(messageType.error, "Error", "Select Gender");
            $(".gender").focus();
            return false;
        }
        if (that.dob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date Of Birth");
            $(".dob").focus();
            return false;
        }
        if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }
        if (that.state == 0) {
            that._msg.Show(messageType.error, "Error", "Select State");
            $(".state").focus();
            return false;
        }
        if (that.city == 0) {
            that._msg.Show(messageType.error, "Error", "Select City");
            $(".city").focus();
            return false;
        }
        if (that.fthrmobile == "" && that.mthrmobile == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Mobile No / Mother Mobile No");
            $(".fthrmobile").focus();
            return false;
        }
        if (that.fthrcode == "" && that.mthrcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Code / Mother Code");
            $(".fthrcode").focus();
            return false;
        }
        if (that.fthrcode == that.mthrcode) {
            that._msg.Show(messageType.error, "Error", "Father Code and Mother Code Not Same");
            $(".fthrcode").focus();
            return false;
        }
        if (that.fthrname == "" && that.mthrname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Name / Mother Name");
            $(".fthrname").focus();
            return false;
        }
        if (that.fthremail == "" && that.mthremail == "") {
            that._msg.Show(messageType.error, "Error", "Enter Father Email / Mother Email");
            $(".fthremail").focus();
            return false;
        }

        if (that.enrlmntid !== 0) {
            if (JSON.stringify(newval) == "{}") {
                that._msg.Show(messageType.warn, "Warning", "No any Changes");
                return false;
            }
        }

        return true;
    }

    // Get Audit Parameter

    getAuditData(ddltype) {
        var that = this;
        var _auditdt = [];

        _auditdt = [
            { "key": "Prospectus Name", "val": ddltype == "old" ? that.prspctname : $("#prspctid option:selected").text().trim(), "fldname": "prspctid", "fldtype": "ddl" },
            { "key": "Prospectus No", "val": that.prspctno, "fldname": "prspctno", "fldtype": "ddl" },
            { "key": "Board Name", "val": ddltype == "old" ? that.boardname : $("#boardid option:selected").text().trim(), "fldname": "boardid", "fldtype": "ddl" },
            { "key": "Child User ID", "val": that.cuid, "fldname": "cuid", "fldtype": "text" },
            { "key": "GR No", "val": that.grno, "fldname": "grno", "fldtype": "text" },
            { "key": "Academic Year", "val": that.ayname, "fldname": "ayid", "fldtype": "text" },
            { "key": "Class Name", "val": ddltype == "old" ? that.classname : $("#classid option:selected").text().trim(), "fldname": "classid", "fldtype": "ddl" },
            { "key": "Roll No", "val": that.rollno, "fldname": "rollno", "fldtype": "text" },
            { "key": "First Name", "val": that.fname, "fldname": "fname", "fldtype": "text" },
            { "key": "Middle Name", "val": that.mname, "fldname": "mname", "fldtype": "text" },
            { "key": "Last Name", "val": that.lname, "fldname": "lname", "fldtype": "text" },
            { "key": "Aadhar No", "val": that.aadharno, "fldname": "aadharno", "fldtype": "text" },
            { "key": "Social Category", "val": ddltype == "old" ? that.soccatname : $("#soccatid option:selected").text().trim(), "fldname": "soccatid", "fldtype": "ddl" },
            { "key": "Gender", "val": ddltype == "old" ? that.gndrval : $("#gender option:selected").text().trim(), "fldname": "gender", "fldtype": "ddl" },
            { "key": "Date of Birth", "val": that.dob, "fldname": "dob", "fldtype": "date" },
            { "key": "Birth Place", "val": that.birthplace, "fldname": "birthplace", "fldtype": "text" },
            { "key": "Other Info", "val": that.otherinfo, "fldname": "otherinfo", "fldtype": "text" },

            // Upload File

            { "key": "Student Photo", "val": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "", "fldname": "filepath", "fldtype": "img" },
            { "key": "Birth Certificate", "val": that.saveBirthCrtfctDT, "fldname": "birthcrfct", "fldtype": "file" },
            { "key": "Address Proof", "val": that.saveAddrProofDT, "fldname": "addrproof", "fldtype": "file" },
            { "key": "Other Document", "val": that.saveDocumentDT, "fldname": "othdocfile", "fldtype": "table" },

            // Contact Details

            { "key": "Address", "val": that.address, "fldname": "address", "fldtype": "text" },
            { "key": "Country", "val": that.country, "fldname": "country", "fldtype": "text" },
            { "key": "State", "val": ddltype == "old" ? that.stname : $("#state option:selected").text().trim(), "fldname": "state", "fldtype": "ddl" },
            { "key": "City", "val": ddltype == "old" ? that.ctname : $("#city option:selected").text().trim(), "fldname": "city", "fldtype": "ddl" },
            { "key": "Area", "val": ddltype == "old" ? that.arname : $("#area option:selected").text().trim(), "fldname": "area", "fldtype": "ddl" },
            { "key": "Pin Code", "val": that.pincode.toString() == "" ? 0 : that.pincode, "fldname": "pincode", "fldtype": "text" },

            // Father Details

            { "key": "Father Code", "val": that.fthrcode, "fldname": "fthrcode", "fldtype": "text" },
            { "key": "Father Name", "val": that.fthrname, "fldname": "fthrfullname", "fldtype": "text" },
            { "key": "Father Mobile", "val": that.fthrmobile, "fldname": "fthrmobile", "fldtype": "text" },
            { "key": "Father Email", "val": that.fthremail, "fldname": "fthremail", "fldtype": "text" },
            { "key": "Father School Name", "val": ddltype == "old" ? that.fthrschname : $("#fthrschname option:selected").text().trim(), "fldname": "fthrschid", "fldtype": "ddl" },
            { "key": "Father Enrollment No", "val": that.fthrenrlmntid, "fldname": "fthrenrlmntid", "fldtype": "text" },
            { "key": "Father Other School Name", "val": that.fthrothschname, "fldname": "fthrothschname", "fldtype": "text" },
            { "key": "Father Qualification", "val": ddltype == "old" ? that.fthrqlfname : $("#fthrqlfid option:selected").text().trim(), "fldname": "fthrqlfid", "fldtype": "ddl" },
            { "key": "Father Occupation", "val": ddltype == "old" ? that.fthrocptnname : $("#fthrocptn option:selected").text().trim(), "fldname": "fthrocptn", "fldtype": "ddl" },
            { "key": "Father Salary", "val": that.fthrsalary, "fldname": "fthrsalary", "fldtype": "text" },

            // Mother Details

            { "key": "Mother Code", "val": that.mthrcode, "fldname": "mthrcode", "fldtype": "text" },
            { "key": "Mother Name", "val": that.mthrname, "fldname": "mthrfullname", "fldtype": "text" },
            { "key": "Mother Mobile", "val": that.mthrmobile, "fldname": "mthrmobile", "fldtype": "text" },
            { "key": "Mother Email", "val": that.mthremail, "fldname": "mthremail", "fldtype": "text" },
            { "key": "Mother School Name", "val": ddltype == "old" ? that.mthrschname : $("#fthrschname option:selected").text().trim(), "fldname": "mthrschid", "fldtype": "ddl" },
            { "key": "Mother Enrollment No", "val": that.mthrenrlmntid, "fldname": "mthrenrlmntid", "fldtype": "text" },
            { "key": "Mother Other School Name", "val": that.mthrothschname, "fldname": "mthrothschname", "fldtype": "text" },
            { "key": "Mother Qualification", "val": ddltype == "old" ? that.mthrqlfname : $("#mthrqlfid option:selected").text().trim(), "fldname": "mthrqlfid", "fldtype": "ddl" },
            { "key": "Mother Occupation", "val": ddltype == "old" ? that.mthrocptnname : $("#mthrocptn option:selected").text().trim(), "fldname": "mthrocptn", "fldtype": "ddl" },
            { "key": "Mother Salary", "val": that.mthrsalary, "fldname": "mthrsalary", "fldtype": "text" },

            { "key": "Sibling", "val": that.saveSiblingDT, "fldname": "studentsibling", "fldtype": "table" }
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldStudentData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newStudentData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var dispflds = [{ "key": "Student Name", "val": name }];

        var auditparams = {
            "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "student", "mdlname": "Student",
            "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that.ayid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
        };

        that._autoservice.saveAuditLog(auditparams);
    }

    // Get Save Parameter

    getStudentParams() {
        var that = this;

        var params = {
            // Student

            "enrlmntid": that.enrlmntid,
            "autoid": that.autoid,

            "prspctid": that.prspctid,
            "prspctno": that.prspctno,
            "boardid": that.boardid,

            "cuid": that.cuid,
            "grno": that.grno,
            "ayid": that.ayid,
            "classid": that.classid,
            "rollno": that.rollno,
            "fname": that.fname,
            "mname": that.mname,
            "lname": that.lname,
            "aadharno": that.aadharno,
            "soccatid": that.soccatid,
            "gender": that.gndrkey,
            "dob": that.dob,
            "birthplace": that.birthplace,
            "otherinfo": that.otherinfo,

            "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",
            "birthcrtfct": that.saveBirthCrtfctDT.length > 0 ? that.saveBirthCrtfctDT : [],
            "addrproof": that.saveAddrProofDT.length > 0 ? that.saveAddrProofDT : [],
            "othdocfile": that.saveDocumentDT.length > 0 ? that.saveDocumentDT : [],

            "address": that.address,
            "country": that.country,
            "state": that.state,
            "city": that.city,
            "area": that.area,
            "pincode": that.pincode.toString() == "" ? 0 : that.pincode,
            "crbyid": that.loginUser.ucode,
            "enttid": that._enttdetails.enttid,
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

            "studentsibling": that.saveSiblingDT,
        }

        return params;
    }

    // Save Student Profile

    saveAdmissionInfo() {
        var that = this;
        var isvalid: boolean = false;

        that.saveBirthCrtfctDT = JSON.stringify(that.birthcrtfctDT);
        that.saveAddrProofDT = JSON.stringify(that.addrproofDT);
        that.saveDocumentDT = JSON.stringify(that.documentDT);
        that.saveSiblingDT = JSON.stringify(that.siblingDT);

        var params = that.getStudentParams();
        that.newStudentData = that.getAuditData("new");

        var newval = that._autoservice.getDiff2Arrays(that.studentData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.studentData);

        isvalid = that.isValidAdmission(newval);

        if (isvalid) {
            commonfun.loader();

            that._admsnservice.saveAdmissionInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_admissioninfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var enrlmntid = dataResult.enrlmntid;

                    if (msgid != "-1") {
                        if (msgid == "1") {
                            that._msg.Show(messageType.success, "Success", msg);
                            that.prspctno = 0;

                            that.resetStudentFields();
                            that.resetParentFields();
                        }
                        else {
                            var _mname = that.mname == "" ? "" : " " + that.mname;
                            that.saveAuditLog(enrlmntid, that.fname + _mname + " " + that.lname, oldval, newval);
                            that._msg.Show(messageType.success, "Success", msg);

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

    // Reset Student Fields

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
                        that.ayname = that.studentDT[0].ayname;
                        that.classid = that.studentDT[0].classid;
                        that.classname = that.studentDT[0].classname;
                        that.boardid = that.studentDT[0].boardid;
                        that.boardname = that.studentDT[0].boardname;
                        that.gndrkey = that.studentDT[0].gndrkey;
                        that.gndrval = that.studentDT[0].gndrval;
                    }
                    else {
                        that.fname = "";
                        that.mname = "";
                        that.lname = "";
                        that.ayid = 0;
                        that.ayname = "";
                        that.classid = 0;
                        that.classname = "";
                        that.boardid = 0;
                        that.boardname = "";
                        that.gndrkey = "M";
                        that.gndrval = "";
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
            that.ayname = "";
            that.classid = 0;
            that.classname = "";
            that.boardid = 0;
            that.boardname = "";
            that.gndrkey = "M";
            that.gndrval = "";
        }

        that.enrlmntid = 0;
        that.cuid = 0;
        that.grno = 0;
        that.rollno = 0;
        that.aadharno = 0;

        that.dob = "";
        that.birthplace = "";
        that.otherinfo = "";

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

        that.birthcrtfctDT = [];
        that.saveBirthCrtfctDT = "[]";
        that.chooseDOBLabel = "Upload Birth Certificate";

        that.addrproofDT = [];
        that.saveAddrProofDT = "[]";
        that.chooseAddrLabel = "Upload Address Proof";

        that.doctypeid = 0;
        that.documentDT = [];
        that.saveDocumentDT = "[]";
        that.siblingDT = [];
        that.saveSiblingDT = "[]";
        that.studentData = {};
    }

    // Reset Parent Fields

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

                        that.getParentAndSibling(that.parentDT[0].prntmob, that.parentDT[0].prnttyp);
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

        that.fthrcode = "";
        that.fthremail = "";
        that.fthrschid = 0;
        that.fthrothschname = "";
        that.fthrenrlmntid = 0;
        that.fthrqlfid = 0;
        that.fthrocptn = "";
        that.fthrsalary = "";

        that.mthrcode = "";
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
                $('#prspctid').prop("disabled", true);
                $('#prspctno').prop("disabled", true);
            }
            else {
                that.resetStudentFields();
                $('#prspctid').prop("disabled", false);
                $('#prspctno').prop("disabled", false);
            }
        });
    }

    // Get Student Profile

    getStudentDetails() {
        var that = this;
        var _mthrfld = null;
        var _fthrfld = null;

        commonfun.loader();

        that._admsnservice.viewStudentDetails({
            "flag": "editadmsn", "id": that.paramsid, "prspctid": that.prspctid, "prspctno": that.prspctno,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.studentDT = data.data[0];
                that.parentDT = data.data[1].filter(a => a.fmltyp == "parent");
                that.siblingDT = data.data[1].filter(a => a.fmltyp == "sibling");
                that.saveSiblingDT = JSON.stringify(that.siblingDT);

                if (that.studentDT.length != 0) {
                    that.enrlmntid = that.studentDT[0].enrlmntid;
                    that.autoid = that.studentDT[0].autoid;

                    if (that.paramsid == 0) {
                        // that.prspctid = 0;
                        // that.prspctno = 0;
                    }
                    else {
                        that.prspctid = that.studentDT[0].prspctid;
                        that.getFormNo();
                        that.prspctno = that.studentDT[0].prspctno;
                    }

                    that.boardid = that.studentDT[0].boardid;
                    that.boardname = that.studentDT[0].boardname;
                    that.cuid = that.studentDT[0].cuid;
                    that.grno = that.studentDT[0].grno;
                    that.ayid = that.studentDT[0].ayid;
                    that.ayname = that.studentDT[0].ayname;
                    that.classid = that.studentDT[0].classid;
                    that.classname = that.studentDT[0].classname;
                    that.rollno = that.studentDT[0].rollno;
                    that.fname = that.studentDT[0].fname;
                    that.mname = that.studentDT[0].mname;
                    that.lname = that.studentDT[0].lname;
                    that.aadharno = that.studentDT[0].aadharno;
                    that.soccatid = that.studentDT[0].soccatid;
                    that.soccatname = that.studentDT[0].soccatname;
                    that.gndrkey = that.studentDT[0].gndrkey;
                    that.gndrval = that.studentDT[0].gndrval;
                    that.dob = that.studentDT[0].dob;
                    that.birthplace = that.studentDT[0].birthplace;
                    that.otherinfo = that.studentDT[0].otherinfo;

                    that.address = that.studentDT[0].address;
                    that.country = that.studentDT[0].country;
                    that.state = that.studentDT[0].state;
                    that.stname = that.studentDT[0].stname;
                    that.fillCityDropDown();
                    that.city = that.studentDT[0].city;
                    that.ctname = that.studentDT[0].ctname;
                    that.fillAreaDropDown();
                    that.area = that.studentDT[0].area;
                    that.arname = that.studentDT[0].arname;
                    that.pincode = that.studentDT[0].pincode;
                    that.isactive = that.studentDT[0].isactive;
                    that.mode = that.studentDT[0].mode;

                    var filepath = that.studentDT[0].FilePath;
                    var birthcrtfct = that.studentDT[0].birthcrtfct;
                    var addrproof = that.studentDT[0].addrproof;
                    var othdocfile = that.studentDT[0].othdocfile;

                    if (filepath != "" && filepath != null) {
                        that.uploadPhotoDT.push({ "athurl": filepath });
                        that.chooseLabel = "Change Student Photo";
                    }
                    else {
                        that.uploadPhotoDT = [];
                        that.chooseLabel = "Upload Student Photo";
                    }

                    if (birthcrtfct != "" && birthcrtfct != null) {
                        that.birthcrtfctDT = birthcrtfct;
                        that.saveBirthCrtfctDT = JSON.stringify(that.birthcrtfctDT);
                        that.chooseDOBLabel = "Change Birth Certificate";
                    }
                    else {
                        that.birthcrtfctDT = [];
                        that.saveBirthCrtfctDT = "[]";
                        that.chooseDOBLabel = "Upload Birth Certificate";
                    }

                    if (addrproof != "" && addrproof != null) {
                        that.addrproofDT = addrproof;
                        that.saveAddrProofDT = JSON.stringify(that.addrproofDT);
                        that.chooseAddrLabel = "Change Address Proof";
                    }
                    else {
                        that.addrproofDT = [];
                        that.saveAddrProofDT = "[]";
                        that.chooseAddrLabel = "Upload Address Proof";
                    }

                    if (othdocfile != "" && othdocfile != null) {
                        that.documentDT = othdocfile;
                        that.saveDocumentDT = JSON.stringify(that.documentDT);
                    }
                    else {
                        that.documentDT = [];
                        that.saveDocumentDT = "[]";
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
                        that.fthrschname = _fthrfld[0].schname;
                        that.fthrenrlmntid = _fthrfld[0].enrlmntid;
                        that.fthrothschname = _fthrfld[0].othschname;
                        that.fthrqlfid = _fthrfld[0].qlfid;
                        that.fthrqlfname = _fthrfld[0].qlftitle;
                        that.fthrocptn = _fthrfld[0].ocptnid;
                        that.fthrocptnname = _fthrfld[0].ocptnname;
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
                        that.mthrschname = _mthrfld[0].schname;
                        that.mthrenrlmntid = _mthrfld[0].enrlmntid;
                        that.mthrothschname = _mthrfld[0].othschname;
                        that.mthrqlfid = _mthrfld[0].qlfid;
                        that.mthrqlfname = _mthrfld[0].qlftitle;
                        that.mthrocptn = _mthrfld[0].ocptnid;
                        that.mthrocptnname = _mthrfld[0].ocptnname;
                        that.mthrsalary = _mthrfld[0].salary;
                    }
                    else {
                        that.resetMotherFields();
                    }
                }
                else {
                    that.resetParentFields();
                }

                that.studentData = that.getStudentParams();
                that.oldStudentData = that.getAuditData("old");
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
