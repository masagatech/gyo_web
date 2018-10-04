import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addemp.comp.html'
})

export class AddEmployeeComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    stateDT: any = [];
    cityDT: any = [];
    areaDT: any = [];

    paramsid: number = 0;
    empid: number = 0;
    loginid: number = 0;
    empcode: string = "";
    emppwd: string = "";
    oldpwd: string = "";
    empname: string = "";

    psngrtype: string = "";
    psngrtypenm: string = "";

    genderDT: any = [];
    gender: string = "";

    birthplace: string = "";
    nationality: string = "";
    currdate: any = "";
    dob: any = "";
    aadharno: string = "";
    licenseno: string = "";

    // Job Profile Fields

    emptypeDT: any = [];
    emptype: string = "";

    salarymodeDT: any = [];
    salarymode: string = "";

    doj: any = "";
    noticedays: number = 0;
    desigid: number = 0;
    salary: any = "";
    aboutus: string = "";

    // Left Fields

    status: string = "active";
    statusnm: string = "Active";
    leftdate: any = "";
    leftreason: string = "";

    // Contact Fields

    mobileno1: string = "";
    mobileno2: string = "";
    email1: string = "";
    email2: string = "";
    address: string = "";
    lat: string = "";
    lon: string = "";
    country: string = "India";
    state: number = 0;
    city: number = 0;
    area: number = 0;
    pincode: number = 0;

    mode: string = "";
    isactive: boolean = true;

    // Upload Photo Fields

    uploadPhotoDT: any = [];
    uploadphotoconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    choosePhotoLabel: string = "";

    // Experience

    totexpyr: number = 0;
    enttname: string = "";
    expdoj: any = "";
    expdor: any = "";
    expsalary: any = "";

    designationDT: any = [];
    expdesigid: number = 0;

    experienceDT: any = [];
    selectedExperience: any = [];
    isaddexperience: boolean = false;
    iseditexperience: boolean = false;

    // Upload Other Document

    documentDT: any = [];
    saveDocumentDT: string = "[]";
    doctypeid: number = 0;
    docfilename: string = "";

    docTypeDT: any = [];
    doctype: string = "";

    uploaddocconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    isaddemp: boolean = false;
    iseditemp: boolean = false;
    isdeleteemp: boolean = false;

    private subscribeParameters: any;

    constructor(private _empservice: EmployeeService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService, private cdRef: ChangeDetectorRef) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getPhotoUploadConfig();
        this.getDocumentUploadConfig();

        this.fillStateDropDown();
        this.fillCityDropDown();
        this.fillAreaDropDown();

        this.getActionRights();
    }

    public ngOnInit() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];

                if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                }
                else {
                    that.psngrtypenm = 'Employee';
                }

                that.fillDropDownList();
                that.getEmployeeDetails();
            }
        });

        that.showPassword("password");
    }

    // Get Action Rights

    getActionRights() {
        var that = this;
        commonfun.loader();

        var params = {
            "flag": "menurights", "entttype": that._enttdetails.entttype, "uid": that.loginUser.uid,
            "utype": that.loginUser.utype, "mcode": "psngrprof"
        };

        that._autoservice.getMenuDetails(params).subscribe(data => {
            that.isaddemp = data.data.filter(a => a.maction == "add")[0].isrights;
            that.iseditemp = data.data.filter(a => a.maction == "edit")[0].isrights;
            that.isdeleteemp = data.data.filter(a => a.maction == "delete")[0].isrights;
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Show / Hide Password

    showPassword(type) {
        if (type == "text") {
            $("#lblshowpwd").removeClass("hide");
            $("#lblshowpwd").addClass("show");
            
            $("#lblhidepwd").removeClass("show");
            $("#lblhidepwd").addClass("hide");
        }
        else {
            $("#lblshowpwd").removeClass("show");
            $("#lblshowpwd").addClass("hide");
            
            $("#lblhidepwd").removeClass("hide");
            $("#lblhidepwd").addClass("show");
        }

        $(".emppwd").attr("type", type);
    }

    // Format Date Time

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
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

    // Fill DropDown List

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._empservice.getEmployeeDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (that.psngrtype == "employee") {
                    that.emptypeDT = data.data.filter(a => a.group == "emptype").filter(a => a.key != "tchr");
                }
                if (that.psngrtype == "teacher") {
                    that.emptypeDT = data.data.filter(a => a.group == "classtype").filter(a => a.key != "tchr");
                }

                that.genderDT = data.data.filter(a => a.group == "gender");
                that.salarymodeDT = data.data.filter(a => a.group == "paymentmode");
                that.designationDT = data.data.filter(a => a.group == "designation");
                that.docTypeDT = data.data.filter(a => a.group == "empdoctype");
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

    // Employee Photo Upload

    getPhotoUploadConfig() {
        var that = this;

        that.uploadphotoconfig.server = that.global.serviceurl + "uploads";
        that.uploadphotoconfig.serverpath = that.global.serviceurl;
        that.uploadphotoconfig.uploadurl = that.global.uploadurl;
        that.uploadphotoconfig.filepath = that.global.filepath;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
            that.uploadphotoconfig.maxFilesize = data.data[0]._filesize;
            that.uploadphotoconfig.acceptedFiles = data.data[0]._filetype;
        }, err => {
            console.log("Error");
        }, () => {
            console.log("Complete");
        })
    }

    onPhotoUpload(event) {
        var that = this;

        that.uploadPhotoDT = [];

        var imgfile = JSON.parse(event.xhr.response);

        setTimeout(function () {
            var imgpath = imgfile[0].path.replace(that.uploadphotoconfig.filepath, "");
            var imgsize = parseFloat(that.getFileSize(imgfile[0].size));

            if (imgsize > 150) {
                that._msg.Show(messageType.error, "Error", "Allowed only below 150 KB File");
            }
            else {
                that.uploadPhotoDT.push({ "athurl": imgpath, "athsize": imgsize })
            }
        }, 1000);
    }

    // Get File Size

    getFileSize(bytes) {
        return bytes = (bytes / 1024).toFixed(2);
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

    removePhotoUpload() {
        this.uploadPhotoDT.splice(0, 1);
    }

    // Active / Deactive Employee

    active_deactiveEmployeeInfo() {
        var that = this;

        var act_deactemp = {
            "empid": that.paramsid,
            "mode": that.mode
        }

        this._empservice.saveEmployeeInfo(act_deactemp).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_employeeinfo;

                if (dataResult.msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", dataResult.msg);
                    that.getEmployeeDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", dataResult.msg);
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

    // Delete Employee

    public deleteEmployee() {
        var that = this;

        that._autoservice.confirmmsgbox("Are you sure, you want to delete ?", "Your record has been deleted", "Your record is safe", function (e) {
            var params = {
                "mode": "delete",
                "empid": that.paramsid
            }

            that._empservice.saveEmployeeInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data;
                    that.backViewData();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                console.log(err);
            }, () => {
                // console.log("Complete");
            });
        });
    }

    // Valid Add Experience

    isValidExperienceFields() {
        var that = this;

        if (that.enttname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Entity Name");
            $(".enttname").focus();

            return false;
        }

        if (that.expdoj == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date of Joining");
            $(".expdoj").focus();

            return false;
        }

        if (that.expdor == "") {
            that._msg.Show(messageType.error, "Error", "Enter Date of Resigning");
            $(".expdor").focus();

            return false;
        }

        if (that.expsalary == "") {
            that._msg.Show(messageType.error, "Error", "Enter Salary");
            $(".expsalary").focus();

            return false;
        }

        if (that.expdesigid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Designation");
            $(".expdesigid").focus();

            return false;
        }

        for (var i = 0; i < that.experienceDT.length; i++) {
            var _expdt = that.experienceDT[i];

            if (that.enttname == _expdt.enttname && that.expdoj == _expdt.doj && that.expdor == _expdt.dor && that.expsalary == _expdt.salary && that.expdesigid == _expdt.desigid) {
                that._msg.Show(messageType.warn, "Warning", "Duplicate Record Not Allowed !!!!");

                return false;
            }
        }

        return true;
    }

    // Reset Add Experience

    resetExperienceFields() {
        var that = this;

        that.enttname = "";
        that.expdoj = "";
        that.expdor = "";
        that.expsalary = "";
        that.expdesigid = 0;

        that.isaddexperience = true;
        that.iseditexperience = false;
    }

    // Add FeExperience

    addExperience() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidExperienceFields();

        if (isvalid) {
            var expdesigname = $("#expdesigid option:selected").text().trim();

            that.experienceDT.push({
                "enttname": that.enttname, "doj": that.expdoj, "dor": that.expdor, "salary": that.expsalary,
                "desigid": that.expdesigid, "designame": expdesigname == "Select Designation" ? "" : expdesigname
            });

            that.resetExperienceFields();
        }
    }

    // Edit Experience

    editExperience(row) {
        var that = this;
        commonfun.loader();

        try {
            that.selectedExperience = row;
            that.isaddexperience = false;
            that.iseditexperience = true;

            that.enttname = row.enttname;
            that.expdoj = row.doj;
            that.expdor = row.dor;
            that.expsalary = row.salary;
            that.expdesigid = row.desigid;

            commonfun.loaderhide();
        }
        catch (e) {
            that._msg.Show(messageType.error, "Error", e);
            commonfun.loaderhide();
        }
    }

    // Update Experience

    updateExperience() {
        var that = this;
        var isvalid = false;

        if (that.iseditexperience == true) {
            isvalid = true;
        }
        else {
            isvalid = that.isValidExperienceFields();
        }

        if (isvalid) {
            var expdesigname = $("#expdesigid option:selected").text().trim();

            that.iseditexperience = false;
            that.selectedExperience.enttname = that.enttname;
            that.selectedExperience.doj = that.expdoj;
            that.selectedExperience.dor = that.expdor;
            that.selectedExperience.desigid = that.expdesigid;
            that.selectedExperience.designame = expdesigname == "Select Designation" ? "" : expdesigname;
            that.selectedExperience.salary = that.expsalary;
            that.resetExperienceFields();
            that.selectedExperience = [];
        }
    }

    // Delete Experience List

    deleteExperience(row) {
        this.experienceDT.splice(this.experienceDT.indexOf(row), 1);
    }

    // Upload Document

    getDocumentUploadConfig() {
        var that = this;

        that._autoservice.getMOM({ "flag": "filebyid", "id": that.global.photoid }).subscribe(data => {
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

    // Document Upload

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

    // Add Document File

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

    // Remove Document File

    removeDocumentFile() {
        this.documentDT.splice(0, 1);
    }

    // Clear Employee Fields

    resetEmployeeFields() {
        var that = this;

        that.empid = 0;
        that.empcode = "";
        that.emppwd = "";
        that.oldpwd = "";
        that.empname = "";

        that.uploadPhotoDT = [];
        that.choosePhotoLabel = "Upload Photo";

        that.gender = "M";
        that.dob = "";
        that.birthplace = "";
        that.nationality = "";
        that.licenseno = "";

        that.salary = "";
        that.salarymode = "";
        that.doj = "";
        that.noticedays = 0;
        that.desigid = 0;
        that.aboutus = "";
        that.status = "active";
        that.leftdate = "";
        that.leftreason = "";

        that.mobileno1 = "";
        that.mobileno2 = "";
        that.email1 = "";
        that.email2 = "";
        that.address = "";
        that.lat = "";
        that.lon = "";

        that.address = that._enttdetails.address;
        that.lat = that._enttdetails.lat;
        that.lon = that._enttdetails.lon;
        that.country = that._enttdetails.country;
        that.state = that._enttdetails.sid;
        that.fillCityDropDown();
        that.city = that._enttdetails.ctid;
        that.fillAreaDropDown();
        that.area = that._enttdetails.arid;
        that.pincode = that._enttdetails.pincode;
        that.choosePhotoLabel = "Upload Photo";
    }

    // Save Data

    isValidEmployee() {
        var that = this;

        if (that.empcode == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.psngrtypenm + " Code");
            $(".empcode").focus();
            return false;
        }
        if (that.emppwd == "") {
            that._msg.Show(messageType.error, "Error", "Enter Password");
            $(".emppwd").focus();
            return false;
        }
        if (that.empname == "") {
            that._msg.Show(messageType.error, "Error", "Enter " + that.psngrtypenm + " Name");
            $(".empname").focus();
            return false;
        }
        if (that.gender == "") {
            that._msg.Show(messageType.error, "Error", "Select Gender");
            $(".gender").focus();
            return false;
        }
        if (that.dob == "") {
            that._msg.Show(messageType.error, "Error", "Enter Birth Date");
            $(".dob").focus();
            return false;
        }
        if (that.emptype == "") {
            that._msg.Show(messageType.error, "Error", "Select Department");
            $(".emptype").focus();
            return false;
        }
        if (that.doj == "") {
            that._msg.Show(messageType.error, "Error", "Enter Joining Date");
            $(".doj").focus();
            return false;
        }
        if (that.noticedays == 0 || that.noticedays.toString() == "") {
            that._msg.Show(messageType.error, "Error", "Enter Notice Days");
            $(".noticedays").focus();
            return false;
        }
        if (that.salarymode == "") {
            that._msg.Show(messageType.error, "Error", "Select Salary Mode");
            $(".salarymode").focus();
            return false;
        }
        if (that.salary == "" || that.salary == "0") {
            that._msg.Show(messageType.error, "Error", "Enter Salary");
            $(".salary").focus();
            return false;
        }
        if (that.status == "left") {
            if (that.leftdate == "") {
                that._msg.Show(messageType.error, "Error", "Enter Left Date");
                $(".leftdate").focus();
                return false;
            }
            if (that.leftreason == "") {
                that._msg.Show(messageType.error, "Error", "Enter Left Reason");
                $(".leftreason").focus();
                return false;
            }
        }
        if (that.mobileno1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Mobile No");
            $(".mobileno1").focus();
            return false;
        }
        if (that.email1 == "") {
            that._msg.Show(messageType.error, "Error", "Enter Email ID");
            $(".email1").focus();
            return false;
        }
        if (that.address == "") {
            that._msg.Show(messageType.error, "Error", "Enter Address");
            $(".address").focus();
            return false;
        }

        return true;
    }

    saveEmployeeInfo() {
        var that = this;
        var isvalid = that.isValidEmployee();

        if (isvalid) {
            commonfun.loader();

            var saveemp = {
                // General Details

                "empid": that.empid,
                "loginid": that.loginid,
                "loginuid": that.loginUser.loginid,
                "empcode": that.empcode,
                "emppwd": that.emppwd,
                "oldpwd": that.oldpwd,
                "empname": that.empname,
                "gender": that.gender,
                "birthplace": that.birthplace,
                "nationality": that.nationality,
                "dob": that.dob,
                "aadharno": that.aadharno,
                "licenseno": that.licenseno,
                "filepath": that.uploadPhotoDT.length > 0 ? that.uploadPhotoDT[0].athurl : "",

                // Contact Details

                "mobileno1": that.mobileno1,
                "mobileno2": that.mobileno2,
                "email1": that.email1,
                "email2": that.email2,
                "address": that.address,
                "geoloc": (that.lat == "" ? "0.00" : that.lat) + "," + (that.lon == "" ? "0.00" : that.lon),
                "country": that.country,
                "state": that.state,
                "city": that.city,
                "area": that.area,
                "pincode": that.pincode.toString() == "" ? 0 : that.pincode,

                // Job Profile

                "emptype": that.emptype,
                "doj": that.doj,
                "noticedays": that.noticedays,
                "salarymode": that.salarymode,
                "salary": that.salary,
                "aboutus": that.aboutus,
                "status": that.status,
                "leftreason": that.status == "left" ? { "leftdate": that.leftdate, "leftreason": that.leftreason } : {},

                // Previous Experience

                "totexpyr": that.totexpyr,
                "expdtls": that.experienceDT,

                // Upload Document

                "docfile": that.documentDT,

                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isactive": that.isactive,
                "mode": "",
                "ptype": that.psngrtype == "employee" ? "emp" : "tchr"
            }

            that._empservice.saveEmployeeInfo(saveemp).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_employeeinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetEmployeeFields();
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
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Employee Data

    getEmployeeDetails() {
        var that = this;
        commonfun.loader();

        var date = new Date();
        var _currdate = new Date(date.getFullYear() - 18, date.getMonth(), date.getDate());
        this.currdate = this.formatDate(_currdate);

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsid = params['id'];

                that._empservice.getEmployeeDetails({
                    "flag": "edit",
                    "id": that.paramsid,
                    "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        var _empdata = data.data;

                        // General Details

                        that.empid = _empdata[0].empid;
                        that.loginid = _empdata[0].loginid;
                        that.empcode = _empdata[0].empcode;
                        that.oldpwd = _empdata[0].emppwd;
                        that.emppwd = _empdata[0].emppwd;
                        that.empname = _empdata[0].empname;

                        var empphoto = _empdata[0].empphoto;
                        var othdocfile = _empdata[0].othdocfile;

                        if (empphoto !== "" && empphoto !== null) {
                            that.uploadPhotoDT.push({ "athurl": empphoto });
                            that.choosePhotoLabel = "Change Photo";
                        }
                        else {
                            that.uploadPhotoDT = [];
                            that.choosePhotoLabel = "Upload Photo";
                        }

                        that.gender = _empdata[0].gndrkey;
                        that.birthplace = _empdata[0].birthplace;
                        that.nationality = _empdata[0].nationality;
                        that.dob = _empdata[0].dob;
                        that.aadharno = _empdata[0].aadharno;
                        that.licenseno = _empdata[0].licenseno;

                        // Contact Details

                        that.email1 = _empdata[0].email1;
                        that.email2 = _empdata[0].email2;
                        that.mobileno1 = _empdata[0].mobileno1;
                        that.mobileno2 = _empdata[0].mobileno2;
                        that.address = _empdata[0].address;
                        that.lat = _empdata[0].lat;
                        that.lon = _empdata[0].lon;
                        that.country = _empdata[0].country;
                        that.state = _empdata[0].state;
                        that.fillCityDropDown();
                        that.city = _empdata[0].city;
                        that.fillAreaDropDown();
                        that.area = _empdata[0].area;
                        that.pincode = _empdata[0].pincode;

                        // Job Profile

                        that.emptype = _empdata[0].emptype;
                        that.desigid = _empdata[0].desigid;
                        that.doj = _empdata[0].doj;
                        that.noticedays = _empdata[0].noticedays;
                        that.salarymode = _empdata[0].salarymode;
                        that.salary = _empdata[0].salary;
                        that.aboutus = _empdata[0].aboutus;
                        that.status = _empdata[0].status;
                        that.statusnm = _empdata[0].statusnm;
                        that.leftdate = _empdata[0].leftdate;
                        that.leftreason = _empdata[0].leftreason;

                        // Experience Details

                        that.experienceDT = _empdata[0].expdtls;
                        that.totexpyr = _empdata[0].totexpyr;

                        // Upload Document

                        that.documentDT = _empdata[0].docfile;

                        that.isactive = _empdata[0].isactive;
                        that.mode = _empdata[0].mode;
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
                that.dob = that.formatDate(_currdate);

                that.resetEmployeeFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/' + this.psngrtype + '/profile']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
