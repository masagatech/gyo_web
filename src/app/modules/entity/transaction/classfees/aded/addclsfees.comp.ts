import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addclsfees.comp.html',
    providers: [CommonService]
})

export class AddClassFeesComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    categoryDT: any = [];
    subCategoryDT: any = [];

    cfid: number = 0;
    catid: number = 0;
    subcatid: number = 0;
    fees: any = "";

    feesDT: any = [];
    selectedFees: any = [];
    iseditfees: boolean = false;

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
                that.resetAllFields();
                commonfun.loaderhide();
            }
        });
    }

    // Reset Fees Details

    resetAllFields() {
        var that = this;

        that.classid = 0;
        that.resetFeesDetails();
        that.feesDT = [];
        that.installmentDT = [];
    }

    // Fill Academic Year, Class, Sub Category Drop Down

    fillDropDownList() {
        var that = this;
        var defayDT: any = [];

        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[0].filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    defayDT = that.ayDT.filter(a => a.iscurrent == true);

                    if (defayDT.length > 0) {
                        that.ayid = defayDT[0].id;
                        that.getClassFees();
                    }
                    else {
                        that.ayid = 0;
                    }
                }

                that.classDT = data.data[0].filter(a => a.group == "class");
                that.categoryDT = data.data[0].filter(a => a.group == "feescategory");
                that.subCategoryDT = data.data[0].filter(a => a.group == "feessubcategory");
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

    addFeesDetails() {
        var that = this;

        if (that.catid == 0) {
            that._msg.Show(messageType.info, "Info", "Please Select Category");
        }
        else if (that.fees == 0) {
            that._msg.Show(messageType.info, "Info", "Please Enter Fees");
        }
        else {
            that.feesDT.push({
                "cfid": that.cfid, "ayid": that.ayid, "clsid": that.classid,
                "catid": that.catid, "catname": $(".catname option:selected").text().trim(),
                "subcatid": that.subcatid, "subcatname": $(".subcatname option:selected").text().trim(),
                "fees": that.fees, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode, "isactive": true
            })

            that.catid = 0;
            that.subcatid = 0;
            that.fees = 0;
        }
    }

    editFeesDetails(row) {
        var that = this;

        that.selectedFees = row;
        that.iseditfees = true;

        that.catid = row.catid;
        that.subcatid = row.subcatid;
        that.fees = row.fees | that.loginUser.globsettings[0];
    }

    deleteFeesDetails(row) {
        row.isactive = false;
    }

    updateFeesDetails() {
        var that = this;

        that.selectedFees.catid = that.catid;
        that.selectedFees.subcatid = that.subcatid;
        that.selectedFees.fees = that.fees;

        that.iseditfees = false;
        that.resetFeesDetails();
    }

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.feesDT.length; i++) {
            field = that.feesDT[i];
            totalfees += parseFloat(field.fees);
        }

        return totalfees;
    }

    totalInstallmentFees() {
        var that = this;
        var field: any = [];

        var _installmentDT: any = [];
        var totalinstlfees = 0;

        _installmentDT = that.installmentDT.filter(a => a.isactive == true);

        for (var i = 0; i < _installmentDT.length; i++) {
            field = _installmentDT[i];
            totalinstlfees += parseInt(field.instlfees);
        }

        return totalinstlfees;
    }

    totalPenaltyFees() {
        var that = this;
        var field: any = [];

        var _penaltyDT: any = [];
        var totalpnltyfees = 0;

        _penaltyDT = that.installmentDT.filter(a => a.isactive == true);

        for (var i = 0; i < _penaltyDT.length; i++) {
            field = _penaltyDT[i];
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

    // Reset Fees Details

    resetFeesDetails() {
        var that = this;

        that.catid = 0;
        that.subcatid = 0;
        that.fees = 0;
    }

    // Save Class Fees

    isValidClassFees() {
        var that = this;

        var totalfees = that.totalFees();
        var totalinstlfees = that.totalInstallmentFees();

        if (that.ayid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Academic Year");
            $(".ay").focus();
            return false;
        }
        else if (that.classid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Class");
            $(".class").focus();
            return false;
        }
        else if (that.installmentDT.length == 0) {
            that._msg.Show(messageType.info, "Info", "Fill atleast 1 Installment");
            $(".class").focus();
            return false;
        }
        else if (totalfees != totalinstlfees) {
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
                            that.resetAllFields();
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
            "flag": "edit", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesDT = data.data[0];
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
        this._router.navigate(['/transaction/classfees']);
    }
}
