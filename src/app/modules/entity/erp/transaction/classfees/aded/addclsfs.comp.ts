import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addclsfs.comp.html',
    providers: [CommonService]
})

export class AddClassFeesComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    categoryDT: any = [];

    feesDT: any = [];
    cfid: number = 0;
    catid: number = 0;
    catfees: any = "";

    installmentDT: any = [];
    selectedInstallmentFees: any = [];
    iseditinstlfees: boolean = false;

    instlid: number = 0;
    instlfees: any = "";
    duedate: any = "";
    pnltyfees: any = "";

    ayid: number = 0;
    classid: number = 0;

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.fillFeesCategory();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.classid = params['id'];
                that.getClassFees();
            }
            else {
                that.resetClassFees();
                commonfun.loaderhide();
            }
        });
    }

    // Fill Academic Year, Class Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that._enttdetails.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[0].filter(a => a.group == "ay");
                
                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getClassFees();
                }

                that.classDT = data.data[0].filter(a => a.group == "class");
                // that.categoryDT = data.data.filter(a => a.group == "feescategory");
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

    // Fill Fees Category

    fillFeesCategory() {
        var that = this;
        var _feesDT: any = [];
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "feescategory", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                _feesDT = data.data[0];

                for (var i = 0; i < _feesDT.length; i++) {
                    var field = _feesDT[i];

                    that.feesDT.push({
                        "cfid": that.cfid, "ayid": 0, "clsid": 0, "catid": field.id, "catname": field.val, "catfees": "0",
                        "cuid": that.loginUser.ucode, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                        "isactive": true
                    })
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

    totalFeesCategory() {
        var that = this;
        var totalfees = 0;

        for (var i = 0; i < that.feesDT.length; i++) {
            var field = that.feesDT[i];

            totalfees += parseInt(field.catfees);
        }

        return totalfees;
    }

    totalInstallmentFees() {
        var that = this;
        var totalinstlfees = 0;
        var _installmentDT = [];
        
        _installmentDT = that.installmentDT.filter(a => a.isactive == true);

        for (var i = 0; i < _installmentDT.length; i++) {
            var field = _installmentDT[i];

            totalinstlfees += parseInt(field.instlfees);
        }

        return totalinstlfees;
    }

    totalPenaltyFees() {
        var that = this;
        var totalpnltyfees = 0;
        var _penaltyDT = [];
        
        _penaltyDT = that.installmentDT.filter(a => a.isactive == true);

        for (var i = 0; i < _penaltyDT.length; i++) {
            var field = _penaltyDT[i];

            totalpnltyfees += parseInt(field.pnltyfees);
        }

        return totalpnltyfees;
    }

    // Add Fees Installment

    resetFeesInstallment() {
        var that = this;

        that.instlid = 0;
        that.instlfees = "";
        that.duedate = "";
        that.pnltyfees = "";
        that.iseditinstlfees = false;
    }

    addFeesInstallment() {
        var that = this;

        if (that.instlfees == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter Fees");
        }
        else if (that.duedate == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter Due Date");
        }
        else if (that.pnltyfees == "") {
            that._msg.Show(messageType.info, "Info", "Please Enter penalty Fees");
        }
        else {
            that.installmentDT.push({
                "instlid": that.instlid, "ayid": that.ayid, "clsid": that.classid, "instlfees": that.instlfees, "duedate": that.duedate,
                "pnltyfees": that.pnltyfees, "cuid": that.loginUser.ucode, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "isactive": true
            })

            that.resetFeesInstallment();
        }
    }

    editFeesInstallment(row) {
        var that = this;

        that.selectedInstallmentFees = row;
        that.iseditinstlfees = true;

        that.instlid = row.instlid;
        that.instlfees = row.instlfees;
        that.duedate = row.editduedate;
        that.pnltyfees = row.pnltyfees;
    }

    deleteFeesInstallment(row) {
        row.isactive = false;
    }

    updateFeesInstallment() {
        var that = this;

        that.selectedInstallmentFees.instlfees = that.instlfees;
        that.selectedInstallmentFees.duedate = that.duedate;
        that.selectedInstallmentFees.pnltyfees = that.pnltyfees;

        that.iseditinstlfees = false;
        that.resetFeesInstallment();
    }

    // Reset Class Fees

    resetClassFees() {
        var that = this;

        that.classid = 0;

        for (var i = 0; i < that.feesDT.length; i++) {
            var field = that.feesDT[i];

            that.feesDT[i].catfees = 0;
        }

        that.installmentDT = [];
    }

    // Save Class Fees

    isValidClassFees() {
        var that = this;

        var totalcatfees = that.totalFeesCategory();
        var totalinstlfees = that.totalInstallmentFees();

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ay").focus();
            return false;
        }
        if (that.classid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Class");
            $(".class").focus();
            return false;
        }

        for (var i = 0; i < that.feesDT.length; i++) {
            var field = that.feesDT[i];

            if (field.catfees == "0") {
                that._msg.Show(messageType.info, "Info", "Please Enter " + field.catname);
                $("." + field.catname).focus();
                return false;
            }
        }
        
        if (that.installmentDT.length == 0) {
            that._msg.Show(messageType.info, "Info", "Fill atleast 1 Installment");
            $(".class").focus();
            return false;
        }
        if (totalcatfees != totalinstlfees) {
            that._msg.Show(messageType.info, "Info", "Total Category Fees and Total Installment Fees Not Matched");
            $(".class").focus();
            return false;
        }

        return true;
    }

    saveClassFees() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidClassFees();

        if (isvalid) {
            commonfun.loader();

            for (var i = 0; i < that.feesDT.length; i++) {
                var field = that.feesDT[i];

                that.feesDT[i].ayid = that.ayid;
                that.feesDT[i].clsid = that.classid;
            }

            var saveclassfees = {
                "classfees": that.feesDT,
                "feesinstallment": that.installmentDT
            }

            that._feesservice.saveClassFees(saveclassfees).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_classfees;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetClassFees();
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

    // Get Class Fees

    getClassFees() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "edit", "ayid": that.ayid, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data[0].length > 0) {
                    that.ayid = data.data[0][0].ayid;
                    that.classid = data.data[0][0].clsid;

                    for (var i = 0; i < that.feesDT.length; i++) {
                        var field = that.feesDT[i];
                        that.feesDT[i].cfid = data.data[0][i].cfid;
                        that.feesDT[i].catfees = data.data[0][i].catfees;
                    }
                }
                else {
                    for (var i = 0; i < that.feesDT.length; i++) {
                        var field = that.feesDT[i];
                        that.feesDT[i].catfees = 0;
                    }
                }

                that.installmentDT = data.data[1];
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
        this._router.navigate(['/erp/transaction/classfees']);
    }
}
