import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { FeesService } from '@services/erp';

declare var google: any;

@Component({
    templateUrl: 'addfscoll.comp.html',
    providers: [CommonService]
})

export class AddFeesCollectionComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    categoryDT: any = [];
    subCategoryDT: any = [];
    paymentmodeDT: any = [];

    fclid: number = 0;
    classfees: any = "";
    ayid: number = 0;

    studid: number = 0;
    studname: string = "";
    studphoto: string = "";
    classid: number = 0;
    classname: string = "";
    gender: string = "";
    rollno: string = "";

    catid: number = 0;
    subcatid: number = 0;
    catfees: any = "";
    fees: any = "";
    receivedate: any = "";
    paymentmode: string = "";
    chequeno: number = 0;
    chequedate: string = "";
    remark: string = "";
    statusid: number = 0;

    feesCollDT: any = [];

    private subscribeParameters: any;

    constructor(private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.studid = params['id'];
                that.getStudentDetails();
                that.getFeesCollection();
            }
            else {
                that.resetFeesCollFields();
                commonfun.loaderhide();
            }
        });
    }

    // Get Student Details

    getStudentDetails() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "all", "studid": that.studid, "uid": that.loginUser.uid, "utype": that.loginUser.utype, "classid": -1,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.studname = data.data[0].studname;
                    that.studphoto = data.data[0].studphoto;
                    that.classid = data.data[0].classid;
                    that.classname = data.data[0].classname;
                    that.gender = data.data[0].gender;
                    that.rollno = data.data[0].rollno;
                    that.classfees = data.data[0].classfees;
                    that.statusid = data.data[0].statusid;

                    that.fillCategoryAndPaymentModeDropDown();
                }
                else {
                    that.studname = "";
                    that.studphoto = "";
                    that.classid = 0;
                    that.classname = "";
                    that.gender = "";
                    that.rollno = "";
                    that.classfees = "";
                    that.statusid = 0;
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

    // Fill Cateogry And Payment Mode

    fillCategoryAndPaymentModeDropDown() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "dropdown", "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.categoryDT = data.data.filter(a => a.group == "category");
                that.paymentmodeDT = data.data.filter(a => a.group == "paymentmode");
                that.subCategoryDT = data.data.filter(a => a.group == "subcategory");
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

    // Fill Sub Cateogry

    fillSubCateogryDropDown() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "subcategory", "catid": that.catid, "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.subCategoryDT = data.data;
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

    // Get Class Fees

    getClassFees() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "fees", "catid": that.catid, "subcatid": that.subcatid, "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.catfees = data.data[0].fees;
                    that.fees = data.data[0].fees;
                }
                else {
                    that.fees = 0;
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

    // Fill Fees Collection

    resetFeesCollFields() {
        var that = this;

        that.receivedate = "";
        that.paymentmode = "";
        that.chequeno = 0;
        that.chequedate = "";
        that.fees = 0;
        that.remark = "";
    }

    // Save Class Fees

    isValidClassFees() {
        var that = this;

        if (that.catid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Category");
            $(".catname").focus();
            return false;
        }

        if (that.fees == "") {
            that._msg.Show(messageType.info, "Info", "Enter Fees");
            $(".fees").focus();
            return false;
        }

        if (that.catfees < that.fees) {
            that._msg.Show(messageType.info, "Info", "Should Be Enter Fees Less Than / Equal " + that.catfees);
            $(".fees").focus();
            return false;
        }

        if (that.receivedate == "") {
            that._msg.Show(messageType.info, "Info", "Enter Receive Date");
            $(".receivedate").focus();
            return false;
        }
        
        if (that.paymentmode == "") {
            that._msg.Show(messageType.info, "Info", "Select Payment Mode");
            $(".paymentmode").focus();
            return false;
        }

        if (that.paymentmode == "cheque") {
            if (that.chequeno == 0) {
                that._msg.Show(messageType.info, "Info", "Enter Cheque No");
                $(".chequeno").focus();
                return false;
            }
            if (that.chequedate == "") {
                that._msg.Show(messageType.info, "Info", "Enter Cheque Date");
                $(".chequedate").focus();
                return false;
            }
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
                "fclid": that.fclid, "ayid": that.ayid, "clsid": that.classid, "studid": that.studid,
                "catid": that.catid, "subcatid": that.subcatid, "fees": that.fees, "receivedate": that.receivedate,
                "paymentmode": that.paymentmode, "chequeno": that.chequeno, "chequedate": that.chequedate,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "cuid": that.loginUser.ucode, "isactive": true
            }

            that._feesservice.saveFeesCollection(savefeescoll).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_feescollection;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.getStudentDetails();
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
            "flag": "history", "studid": that.studid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/feescollection']);
    }
}
