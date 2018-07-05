import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addassres.comp.html',
    providers: [CommonService]
})

export class AddAssesmentResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    _editassres: any = [];

    ayDT: any = [];
    classDT: any = [];
    subjectDT: any = [];
    activityDT: any = [];

    studentDT: any = [];
    studid: number = 0;
    studname: string = "";
    selectedStudent: any = [];

    mode: string = "";
    assid: number = 0;
    assresid: number = 0;
    ayid: number = 0;
    ayname: string = "";
    clsid: number = 0;
    clsname: string = "";
    asstype: string = "";
    asstyphead: string = "";
    asstypname: string = "";
    assdate: string = "";
    frmdt: any = "";
    todt: any = "";

    assesmentList: any = [];
    gradeList: any = [];

    issendemail: boolean = false;

    remark: string = "";

    private subscribeParameters: any;

    constructor(private _assservice: AssesmentService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this._editassres = this.getAssesmentResultForEdit();

        this.add_edit_AssesmentResult();
        this.fillAYAndClassDropDown();
        this.fillAssesmentTypeDropDown();
        this.setFromDateAndToDate();

        this.getAssesmentResult();
    }

    public ngOnInit() {

    }

    add_edit_AssesmentResult() {
        var editassres = Cookie.get("_editassres_");

        if (editassres == null) {
            this._router.navigate(['/transaction/assesmentresult/add']);
        }
    }

    getAssesmentResultForEdit() {
        let editassres = Cookie.get("_editassres_");

        if (editassres !== null) {
            return JSON.parse(editassres);
        }
        else {
            return {};
        }
    }

    // Fill AY And Class Drop Down

    fillAYAndClassDropDown() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data.filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    if (Cookie.get("_ayid_") != null) {
                        that.ayid = parseInt(Cookie.get("_ayid_"));
                    }
                    else {
                        defayDT = that.ayDT.filter(a => a.iscurrent == true);

                        if (defayDT.length > 0) {
                            that.ayid = defayDT[0].id;
                        }
                        else {
                            that.ayid = that._enttdetails.ayid;
                        }
                    }
                }

                that.classDT = data.data.filter(a => a.group == "class");
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

    fillAssesmentTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._assservice.getAssesmentDetails({
            "flag": "asstypeddl", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subjectDT = data.data.filter(a => a.subtype == "Subject");
                that.activityDT = data.data.filter(a => a.subtype == "Activity");
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

        this.selectedStudent = [];
    }

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.clsid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.studentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.getAssesmentResult();
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

    setFromDateAndToDate() {
        var date = new Date();
        var _frmdt = new Date(date.getFullYear(), date.getMonth() - 1, date.getDate());
        var _todt = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        this.frmdt = this.formatDate(_frmdt);
        this.todt = this.formatDate(_todt);
    }

    // Save Assesment Result

    isValidation() {
        var that = this;

        var date = new Date();
        var today = that.formatDate(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

        if (that.ayid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }
        else if (that.clsid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Class");
            $(".class").focus();
            return false;
        }
        else if (that.asstype == "") {
            that._msg.Show(messageType.error, "Error", "Select Assesment Type");
            $(".asstype").focus();
            return false;
        }
        else if (that.studid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Student Name");
            $(".studname input").focus();
            return false;
        }
        else if (that.frmdt == "") {
            that._msg.Show(messageType.error, "Error", "Enter From Date");
            $(".frmdt").focus();
            return false;
        }
        else if (that.frmdt > today) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be From Date Less Than Current Date");
            $(".frmdt").focus();
            return false;
        }
        else if (that.todt == "") {
            that._msg.Show(messageType.error, "Error", "Enter To Date");
            $(".todt").focus();
            return false;
        }
        else if (that.frmdt > that.todt) {
            that._msg.Show(messageType.error, "Error", "Sholuld Be To Date Greater Than From Date");
            $(".todt").focus();
            return false;
        }

        if (that.assesmentList.length > 0) {
            for (var i = 0; i < that.assesmentList.length; i++) {
                var _asslist = that.assesmentList[i];

                if (_asslist.gradeid == null || _asslist.gradeid == "0") {
                    that._msg.Show(messageType.error, "Error", "Select " + _asslist.subheading + " Grade");
                    $(".grade" + _asslist.assresid).focus();
                    return false;
                }
            }
        }

        return true;
    }

    saveAssesmentResult() {
        var that = this;
        var _asslist = null;
        var _isvalid: boolean = false;

        _isvalid = that.isValidation();

        var asstypid = that.asstype == "" ? "0" : that.asstype.split('~')[1];
        var asstypname = that.asstype == "" ? "" : that.asstype.split('~')[0];

        if (_isvalid) {
            commonfun.loader();

            var params = {
                "mode": that.mode, "assid": 0, "ayid": that.ayid, "clsid": that.clsid,
                "asstypid": asstypid, "asstyp": asstypname, "asstypname": $("#asstypid option:selected").text().trim(),
                "studid": that.studid, "frmdt": that.frmdt, "todt": that.todt,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "issendemail": that.issendemail, "assesmentresult": that.assesmentList, "remark": that.remark
            }

            that._assservice.saveAssesmentResult(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_assesmentresult;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.getAssesmentResult();
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

    // Get Assesment

    getAssesmentResult() {
        var that = this;
        var params = {};

        var editassres = Cookie.get("_editassres_");

        if (editassres == null) {
            that.mode = "add";

            var asstypid = that.asstype == "" ? "0" : that.asstype.split('~')[1];
            var asstypname = that.asstype == "" ? "" : that.asstype.split('~')[0];

            params = {
                "flag": "aded", "mode": "add", "assid": 0, "ayid": that.ayid, "classid": that.clsid,
                "asstypid": asstypid, "asstyp": asstypname, "studid": that.studid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
            }
        }
        else {
            that.mode = "edit";

            that.ayid = that._editassres.ayid;
            that.ayname = that._editassres.ayname;
            that.clsid = that._editassres.classid;
            that.clsname = that._editassres.classname;
            that.asstyphead = that._editassres.asstyphead;
            that.asstypname = that._editassres.asstypname;
            that.assdate = that._editassres.assdate;

            that.fillAssesmentTypeDropDown();
            that.asstype = that._editassres.asstyp + "~" + that._editassres.asstypid;

            that.studid = that._editassres.studid;
            that.studname = that._editassres.studname;

            that.selectedStudent = { value: that.studid, label: that.studname };
            that.frmdt = that._editassres.frmdt;
            that.todt = that._editassres.todt;

            var asstypid = that.asstype == "" ? "0" : that.asstype.split('~')[1];
            var asstypname = that.asstype == "" ? "" : that.asstype.split('~')[0];

            params = {
                "flag": "aded", "mode": "edit", "assid": 0, "ayid": that.ayid, "classid": that.clsid,
                "asstypid": asstypid, "asstyp": asstypname, "studid": that.studid, "frmdt": that.frmdt, "todt": that.todt,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
            }
        }

        commonfun.loader();

        that._assservice.getAssesmentResult(params).subscribe(data => {
            try {
                that.assesmentList = data.data;

                if (that.assesmentList.length > 0) {
                    that.gradeList = that.assesmentList[0].gradelist;
                    that.remark = that.assesmentList[0].remark;
                }
                else {
                    that.remark = "";
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
        this._router.navigate(['/transaction/assesmentresult']);
    }
}
