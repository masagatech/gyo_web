import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { AssesmentService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addassres.comp.html',
    providers: [CommonService]
})

export class AddAssesmentResultComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    subjectDT: any = [];
    activityDT: any = [];

    studentDT: any = [];
    studsdata: any = [];

    assparamid: number = 0;
    assid: number = 0;
    assresid: number = 0;
    ayid: number = 0;
    clsid: number = 0;
    asstype: string = "";
    studid: number = 0;
    studname: string = "";
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

        this.fillAYAndClassDropDown();
        this.fillAssesmentTypeDropDown();
        this.setFromDateAndToDate();
    }

    public ngOnInit() {
        // this.editAssesmentDetails();
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
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                    }
                    else {
                        that.ayid = 0;
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

        this.studsdata = [];
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

                for (var j = 0; j < _asslist.gradelist.length; j++) {
                    var _gradelist = _asslist.gradelist[j];

                    if (_gradelist.gradeid == null || _gradelist.gradeid == "0") {
                        that._msg.Show(messageType.error, "Error", "Select " + _asslist.subheading + " Grade");
                        $(".grade" + _asslist.assresid).focus();
                        return false;
                    }
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

            for (var i = 0; i < that.assesmentList.length; i++) {
                _asslist = that.assesmentList[i];
                _asslist.ayid = that.ayid;
                _asslist.clsid = that.clsid;
                _asslist.asstypid = asstypid;
                _asslist.studid = that.studid;
                _asslist.frmdt = that.frmdt;
                _asslist.todt = that.todt;
                _asslist.enttid = that._enttdetails.enttid;
                _asslist.wsautoid = that._enttdetails.wsautoid;
                _asslist.cuid = that.loginUser.ucode;
            }

            var params = {
                "assid": that.assparamid, "ayid": that.ayid, "clsid": that.clsid, "asstypid": asstypid, "asstyp": asstypname, "studid": that.studid,
                "frmdt": that.frmdt, "todt": that.todt, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
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
        commonfun.loader();

        var asstypid = that.asstype == "" ? "0" : that.asstype.split('~')[1];
        var asstypname = that.asstype == "" ? "" : that.asstype.split('~')[0];

        that._assservice.getAssesmentResult({
            "flag": "aded", "assid": that.assparamid, "ayid": that.ayid, "classid": that.clsid, "asstypid": asstypid, "asstyp": asstypname,
            "studid": that.studid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.assesmentList = data.data;

                if (that.assesmentList.length > 0) {
                    if (that.assparamid !== 0) {
                        that.assid = that.assparamid;
                        that.clsid = that.assesmentList[0].clsid;
                        that.fillAssesmentTypeDropDown();
                        that.asstype = that.assesmentList[0].asstyp + "~" + that.assesmentList[0].asstypid;
                        that.frmdt = that.assesmentList[0].frmdt;
                        that.todt = that.assesmentList[0].todt;
                    }
                    else {
                        that.assid = that.assesmentList[0].assid;
                    }

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
