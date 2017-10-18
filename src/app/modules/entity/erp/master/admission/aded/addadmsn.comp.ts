import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AdmissionService } from '@services/erp';

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

    ayDT: any = [];
    classDT: any = [];
    genderDT: any = [];

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    qualificationDT: any = [];

    familyDT: any = [];
    selectedSibling: any = [];
    iseditsibling: boolean = false;

    enrlmntid: number = 0;
    fname: string = "";
    mname: string = "";
    lname: string = "";
    ayid: number = 0;
    classid: number = 0;
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

    fmlid: number = 0;

    // Sibling

    relation: string = "";
    sibfullname: string = "";
    sibage: string = "";
    sibclassid: number = 0;
    sibschoolid: number = 0;
    sibschoolname: string = "";
    sibenrlmntid: number = 0;
    sibisactive: boolean = false;

    // Parents - Mother

    mthrname: string = "";
    mthrmobile: string = "";
    mthremail: string = "";
    mthrqlfid: number = 0;
    mthrocptn: string = "";
    mthrsalary: any = "";
    mthrschoolid: number = 0;
    mthrschoolname: string = "";
    mthrenrlmntid: number = 0;

    // Parents - Father

    fthrname: string = "";
    fthrmobile: string = "";
    fthremail: string = "";
    fthrqlfid: number = 0;
    fthrocptn: string = "";
    fthrsalary: any = "";
    fthrschoolid: number = 0;
    fthrschoolname: string = "";
    fthrenrlmntid: number = 0;

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
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 1000);

        this.getAdmissionDetails();
    }

    // Fill Academic Year, Class DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._admsnservice.getStudentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].key;
                }

                that.classDT = data.data.filter(a => a.group == "class");
                that.genderDT = data.data.filter(a => a.group == "gender");
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

    // Clear Fields

    resetAdmissionFields() {
        var that = this;

        that.enrlmntid = 0
        that.fname = "";
        that.mname = "";
        that.lname = "";
        that.classid = 0;
        that.fthrname = "";
        that.mthrname = "";
        that.fthremail = "";
        that.mthremail = "";
        that.fthrmobile = "";
        that.mthrmobile = "";

        that.address = "";
        that.state = 0;
        that.city = 0;
        that.remark1 = "";
        that.otherinfo = "";

        that.uploadPhotoDT = [];
        that.chooseLabel = "Upload Student Photo";

        that.uploadDOBCertificate = [];
        that.chooseDOBLabel = "Upload Birth Certificate";

        that.uploadAddrProof = [];
        that.chooseAddrLabel = "Upload Address Proof";
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

        for (var i = 0; i < that.familyDT.length; i++) {
            sibfields = that.familyDT[i];

            if ((sibfields.relation == that.relation) && (sibfields.fullname == that.sibfullname)
                && (sibfields.age == that.sibage) && (sibfields.classid == that.classid)) {
                return true;
            }
        }

        return false;
    }

    // Sibling Validation

    isSiblingValidation() {
        var that = this;

        if (that.relation == "") {
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
                that.familyDT.push({
                    "fmlid": that.fmlid, "relation": that.relation, "relationnm": $(".relation option:selected").text().trim(),
                    "fullname": that.sibfullname, "age": that.sibage,
                    "classid": that.sibclassid, "classname": $(".sibclassname option:selected").text().trim(),
                    "schoolid": that.sibschoolid, "schoolname": $(".sibschoolname option:selected").text().trim(),
                    "otherschoolname": that.sibschoolname, "enrlmntid": that.sibschoolid == 0 ? 0 : that.sibenrlmntid,
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
        that.relation = row.relation;
        that.sibfullname = row.sibfullname;
        that.sibage = row.sibage;
        that.sibclassid = row.sibclassid;
        that.sibschoolid = row.sibschoolid;
        that.sibschoolname = row.sibotherschoolname;
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

        that.selectedSibling.relation = that.relation;
        that.selectedSibling.sibfullname = that.sibfullname;
        that.selectedSibling.sibage = that.sibage;
        that.selectedSibling.sibclassid = that.sibclassid;
        that.selectedSibling.sibschoolid = that.sibschoolid;
        that.selectedSibling.sibotherschoolname = that.sibschoolname;
        that.selectedSibling.sibenrlmntid = that.sibenrlmntid;
        that.iseditsibling = false;

        that.resetSibling();
    }

    // Reset Sibling

    resetSibling() {
        var that = this;

        that.relation = "";
        that.sibfullname = "";
        that.sibage = "";
        that.sibclassid = 0;
        that.sibschoolid = 0;
        that.sibschoolname = "";
        that.sibenrlmntid = 0;
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
        else if (that.mname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Middle Name");
            $(".mname").focus();
            return false;
        }
        else if (that.lname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Last Name");
            $(".lname").focus();
            return false;
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }
        else if (that.fthremail == "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Email");
            $(".fthremail").focus();
            return false;
        }
        else if (that.fthrmobile == "") {
            that._msg.Show(messageType.error, "Error", "Enter Primary Mobile");
            $(".fthrmobile").focus();
            return false;
        }
        else if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Residental Address");
            $(".resiaddr").focus();
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

    saveAdmissionInfo() {
        var that = this;
        var isvalid: boolean = false;
        var parentDT: any = [];

        isvalid = that.isValidAdmission();

        if (isvalid) {
            commonfun.loader();

            if (that.enrlmntid == 0) {
                that.familyDT.push({
                    "fmlid": that.fmlid,
                    "relation": "father",
                    "fullname": that.fthrname,
                    "mobile": that.fthrmobile,
                    "email": that.fthremail,
                    "schoolid": that.fthrschoolid,
                    "enrlmntid": that.fthrschoolid == 0 ? 0 : that.fthrenrlmntid,
                    "schoolname": that.fthrschoolname,
                    "qlfid": that.fthrqlfid,
                    "occupation": that.fthrocptn,
                    "salary": that.fthrsalary == "" ? "0" : that.fthrsalary,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._enttdetails.wsautoid
                })

                that.familyDT.push({
                    "fmlid": that.fmlid,
                    "relation": "mother",
                    "fullname": that.mthrname,
                    "mobile": that.mthrmobile,
                    "email": that.mthremail,
                    "schoolid": that.mthrschoolid,
                    "enrlmntid": that.mthrschoolid == 0 ? 0 : that.mthrenrlmntid,
                    "schoolname": that.mthrschoolname,
                    "qlfid": that.mthrqlfid,
                    "occupation": that.mthrocptn,
                    "salary": that.mthrsalary == "" ? "0" : that.mthrsalary,
                    "cuid": that.loginUser.ucode,
                    "wsautoid": that._enttdetails.wsautoid
                })
            }

            var saveAdmission = {
                "enrlmntid": that.enrlmntid,
                "fname": that.fname,
                "mname": that.mname,
                "lname": that.lname,
                "ayid": that.ayid,
                "enttid": that._enttdetails.enttid,
                "classid": that.classid,
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

                "studentfamily": that.familyDT,
                "fthrmobile": that.fthrmobile,
                "mthrmobile": that.mthrmobile
            }

            that._admsnservice.saveAdmissionInfo(saveAdmission).subscribe(data => {
                try {
                    var dataResult = data.data;
                    var msg = dataResult[0].funsave_admissioninfo.msg;
                    var msgid = dataResult[0].funsave_admissioninfo.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.resetAdmissionFields();
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

    // Get Admission Data

    getAdmissionDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = this._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.enrlmntid = params['id'];

                that._admsnservice.getStudentDetails({
                    "flag": "edit",
                    "id": that.enrlmntid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.enrlmntid = data.data[0].enrlmntid;
                            that.ayid = data.data[0].ayid;
                            that.fname = data.data[0].fname;
                            that.mname = data.data[0].mname;
                            that.lname = data.data[0].lname;
                            that.classid = data.data[0].classid;
                            that.dob = data.data[0].dob;
                            that.birthplace = data.data[0].birthplace;
                            that.gender = data.data[0].gender;

                            that.address = data.data[0].address;
                            that.country = data.data[0].country;
                            that.state = data.data[0].state;
                            that.fillCityDropDown();
                            that.city = data.data[0].city;
                            that.fillAreaDropDown();
                            that.area = data.data[0].area;
                            that.pincode = data.data[0].pincode;
                            that.remark1 = data.data[0].remark1;
                            that.isactive = data.data[0].isactive;
                            that.mode = data.data[0].mode;
                            that.otherinfo = data.data[0].otherinfo;

                            that.mthrname = data.data[0].mothername;
                            that.fthrname = data.data[0].fathername;
                            that.mthrmobile = data.data[0].mobileno2;
                            that.mthremail = data.data[0].email2;
                            that.fthrmobile = data.data[0].mobileno1;
                            that.fthremail = data.data[0].email1;
                            that.mthrschoolid = data.data[0].mthrschid;
                            that.fthrschoolid = data.data[0].fthrschid;
                            that.mthrschoolname = data.data[0].mthrothschnm;
                            that.fthrschoolname = data.data[0].fthrothschnm;
                            that.mthrqlfid = data.data[0].mthrqlfid;
                            that.fthrqlfid = data.data[0].fthrqlfid;
                            that.mthrocptn = data.data[0].mthrocptn;
                            that.fthrocptn = data.data[0].fthrocptn;
                            that.mthrsalary = data.data[0].mthrsalary;
                            that.fthrsalary = data.data[0].fthrsalary;

                            if (data.data[0].FilePath !== "" || data.data[0].FilePath !== null) {
                                that.uploadPhotoDT.push({ "athurl": data.data[0].FilePath });
                                that.chooseLabel = "Change Student Photo";
                            }
                            else {
                                that.uploadPhotoDT = [];
                            }

                            if (data.data[0].birthcrtfct !== "" || data.data[0].birthcrtfct !== null) {
                                that.uploadDOBCertificate.push({ "athurl": data.data[0].birthcrtfct });
                                that.chooseDOBLabel = "Change Birth Certificate";
                            }
                            else {
                                that.uploadDOBCertificate = [];
                            }

                            if (data.data[0].addrproof !== "" || data.data[0].addrproof !== null) {
                                that.uploadAddrProof.push({ "athurl": data.data[0].addrproof });
                                that.chooseAddrLabel = "Change Address Proof";
                            }
                            else {
                                that.uploadAddrProof = [];
                            }
                        }
                        else {
                            that.resetAdmissionFields();
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
                that.resetAdmissionFields();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/master/student']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
