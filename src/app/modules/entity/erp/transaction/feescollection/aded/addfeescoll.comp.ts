import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addfeescoll.comp.html',
    providers: [CommonService]
})

export class AddFeesCollectionComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    ayDT: any = [];
    classDT: any = [];
    studentDT: any = [];
    paymentmodeDT: any = [];

    fclid: number = 0;
    ayid: number = 0;
    classid: number = 0;
    classfees: any = "";
    studentwiseclassfees: any = "";
    studid: number = 0;
    fees: any = "";
    receivedate: any = "";
    paymentmode: string = "";
    chequeno: number = 0;
    chequedate: string = "";
    remark: string = "";

    feesCollDT: any = [];
    selectedFeesColl: any = [];
    iseditfeescoll: boolean = false;

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillAYAndClassDropDown();
        this.fillStudentAndPaymentModeDropDown();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.classid = params['id'];
                that.getFeesCollection();
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
        that.resetFeesCollection();
        that.feesCollDT = [];
    }

    // Fill Academic Year, Class

    fillAYAndClassDropDown() {
        var that = this;
        commonfun.loader();

        that._feesservice.getClassFees({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.ayDT = data.data[0].filter(a => a.group == "ay");

                if (that.ayDT.length > 0) {
                    that.ayid = that.ayDT.filter(a => a.iscurrent == true)[0].id;
                    that.getFeesCollection();
                }

                that.classDT = data.data[0].filter(a => a.group == "class");
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

    // Fill Student And Payment Mode

    fillStudentAndPaymentModeDropDown() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "classid": that.classid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                var classFeesDT = data.data.filter(a => a.group == "classfees");

                if (classFeesDT.length > 0) {
                    that.classfees = classFeesDT[0].key;
                    that.studentwiseclassfees = classFeesDT[0].val;
                }
                else {
                    that.classfees = "0";
                    that.studentwiseclassfees = "0";
                }

                that.studentDT = data.data.filter(a => a.group == "student");
                that.paymentmodeDT = data.data.filter(a => a.group == "paymentmode");
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

    // Fill Fees Collection

    resetFeesCollFields(){
        var that = this;

        that.studid = 0;
        that.fees = 0;
        that.receivedate = "";
        that.paymentmode = "";
        that.chequeno = 0;
        that.chequedate = "";
        that.remark = "";
    }

    addFeesCollection() {
        var that = this;

        if (that.studid == 0) {
            that._msg.Show(messageType.info, "Info", "Please Select Student");
        }
        else if (that.fees == 0) {
            that._msg.Show(messageType.info, "Info", "Please Enter Fees");
        }
        else {
            that.feesCollDT.push({
                "fclid": that.fclid, "ayid": that.ayid, "clsid": that.classid,
                "studid": that.studid, "studname": $(".studname option:selected").text().trim(),
                "fees": that.fees, "receivedate": that.receivedate,
                "paymentmode": that.paymentmode, "paymentmodenm": $(".paymentmode option:selected").text().trim(),
                "chequeno": that.chequeno, "chequedate": that.chequedate,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode, "isactive": true
            })

            that.resetFeesCollFields();
        }
    }

    editFeesCollection(row) {
        var that = this;

        that.selectedFeesColl = row;
        that.iseditfeescoll = true;

        that.studid = row.studid;
        that.fees = row.fees | that.loginUser.globsettings[0];
        that.receivedate = row.receivedate;
        that.paymentmode = row.paymentmode;
        that.chequeno = row.chequeno;
        that.chequedate = row.chequedate;
        that.remark = row.remark;
    }

    deleteFeesCollection(row) {
        row.isactive = false;
    }

    updateFeesCollection() {
        var that = this;

        that.selectedFeesColl.studid = that.studid;
        that.selectedFeesColl.fees = that.fees;
        that.selectedFeesColl.receivedate = that.receivedate;
        that.selectedFeesColl.paymentmode = that.paymentmode;
        that.selectedFeesColl.chequeno = that.chequeno;
        that.selectedFeesColl.chequedate = that.chequedate;
        that.selectedFeesColl.remark = that.remark;

        that.iseditfeescoll = false;
        that.resetFeesCollFields();
    }

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.feesCollDT.length; i++) {
            field = that.feesCollDT[i];
            totalfees += parseFloat(field.fees);
        }

        return totalfees;
    }

    // Reset Fees Details

    resetFeesCollection() {
        var that = this;

        that.studid = 0;
        that.fees = 0;
    }

    // Save Class Fees

    isValidClassFees() {
        var that = this;

        var totalfees = that.totalFees();

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

        return true;
    }

    saveFeesCollection() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidClassFees();

        if (isvalid) {
            commonfun.loader();

            var savefeescoll = {
                "feescollection": that.feesCollDT
            }

            that._feesservice.saveFeesCollection(savefeescoll).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_feescollection;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getFeesCollection();
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

    getFeesCollection() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "edit", "ayid": that.ayid, "classid": that.classid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesCollDT = data.data;
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
}
