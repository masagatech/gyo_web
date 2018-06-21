import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

@Component({
    templateUrl: 'addfsexc.comp.html'
})

export class AddFeesExcemptionComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];

    ayid: number = 0;

    paramsfsexid: number = 0;
    fsexid: number = 0;
    clsid: number = 0;
    orgfees: any = "";
    excfees: any = "";
    remark: string = "";

    isallstuds: boolean = false;
    autoStudentDT: any = [];
    selectedStudent: any = {};
    studid: number = 0;
    studname: string = "";

    studentList: any = [];

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.paramsfsexid = params['id'];
                that.getFeesExcemption();
            }
            else {
                that.resetFeesExcemption();
                commonfun.loaderhide();
            }
        });
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getFeesExcemption({
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

    // Get Original Fees

    getOriginalFees() {
        var that = this;

        commonfun.loader();

        that._feesservice.getFeesExcemption({
            "flag": "originalfees", "classid": that.clsid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length == 0) {
                    that.orgfees = 0;
                }
                else {
                    that.orgfees = data.data[0].orgfees;
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

    // Auto Completed Student

    getStudentData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "student",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "classid": this.clsid,
            "ayid": this.ayid,
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.autoStudentDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Student

    selectStudentData(event) {
        this.studid = event.value;
        this.studname = event.label;

        this.addStudentList();
    }

    // Check Duplicate Student

    isDuplicateStudent() {
        var that = this;

        for (var i = 0; i < that.studentList.length; i++) {
            var field = that.studentList[i];

            if (field.studid == that.studid) {
                that._msg.Show(messageType.error, "Error", "Duplicate Student not Allowed");
                return true;
            }
        }

        return false;
    }

    // Add Student List

    addStudentList() {
        var that = this;
        var duplothtchr = that.isDuplicateStudent();

        if (!duplothtchr) {
            that.studentList.push({
                "studid": that.studid,
                "studname": that.studname,
            });
        }

        that.studid = 0;
        that.studname = "";
        that.selectedStudent = {};
        $(".studname input").focus();
    }

    // Delete Student List

    deleteStudentList(row) {
        this.studentList.splice(this.studentList.indexOf(row), 1);
    }

    // Reset Fees Excemption

    resetFeesExcemption() {
        var that = this;

        that.ayid = 0;
        that.clsid = 0;
        that.studid = 0;
        that.studname = "";
        that.selectedStudent = {};
        that.orgfees = "";
        that.excfees = "";
    }

    // Save Fees Excemption

    isValidFeesExcemption() {
        var that = this;

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ayname").focus();
            return false;
        }

        if (that.clsid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Class");
            $(".clsname").focus();
            return false;
        }

        if (that.orgfees == "") {
            that._msg.Show(messageType.info, "Info", "Enter Original Fees");
            $(".orgfees").focus();
            return false;
        }

        if (that.excfees == "") {
            that._msg.Show(messageType.info, "Info", "Enter Excemption Fees");
            $(".excfees").focus();
            return false;
        }

        if (parseFloat(that.excfees) >= parseFloat(that.orgfees)) {
            that._msg.Show(messageType.info, "Info", "Should Be Excemption Fees Less Than Original Fees");
            $(".excfees").focus();
            return false;
        }

        if (!that.isallstuds) {
            if (that.studentList.length == 0) {
                that._msg.Show(messageType.info, "Info", "Fill Atleast 1 Student");
                $(".studname input").focus();
                return false;
            }
        }

        return true;
    }

    saveFeesExcemption() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidFeesExcemption();

        if (isvalid) {
            commonfun.loader();

            var _studlist: string[] = [];

            if (that.isallstuds) {
                _studlist = ["0"];
            }
            else {
                _studlist = Object.keys(that.studentList).map(function (k) { return that.studentList[k].studid });
            }

            var params = {
                "fsexid": that.fsexid, "ayid": that.ayid, "clsid": that.clsid, "orgfees": that.orgfees, "excfees": that.excfees,
                "studid": _studlist, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode, "isactive": true
            }

            that._feesservice.saveFeesExcemption(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_feesexcemption;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetFeesExcemption();
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

    // Get Fees Excemption

    getFeesExcemption() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesExcemption({
            "flag": "edit", "id": that.paramsfsexid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                var viewfees = data.data;

                that.fsexid = viewfees[0].fsexid;
                that.ayid = viewfees[0].ayid;
                that.clsid = viewfees[0].clsid;
                that.orgfees = viewfees[0].orgfees;
                that.excfees = viewfees[0].excfees;

                that.isallstuds = viewfees[0].isallstuds;
                that.studentList = viewfees[0].studlist;
                
                that.remark = viewfees[0].remark;
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
        this._router.navigate(['/transaction/feesexcemption']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
