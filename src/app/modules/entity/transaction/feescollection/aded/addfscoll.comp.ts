import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { NotificationService, FeesService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addfscoll.comp.html'
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
    pendingfees: any = "";
    ayid: number = 0;

    studid: number = 0;
    studname: string = "";
    studphoto: string = "";
    classid: number = 0;
    classcode: number = 0;
    classname: string = "";
    gndrkey: string = "";
    gndrval: string = "";
    rollno: string = "";

    catid: number = 0;
    scatid: number = 0;
    catfees: any = "";
    fees: any = "";
    receivedate: any = "";
    paymentmode: string = "";
    chequestatus: string = "";
    chequeno: number = 0;
    chequedate: any = null;
    remark: string = "";
    statusid: number = 0;

    studsFilterDT: any = [];
    studentFeesDT: any = [];
    selectedFees: any = {};
    isaddfees: boolean = false;
    iseditfees: boolean = false;

    fltr_recvdate: string = "";
    fltr_rpttype: string = "";

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        private _ntfservice: NotificationService, private _feesservice: FeesService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.isadd = _router.url.indexOf("/add") > -1;
        this.isedit = _router.url.indexOf("/edit") > -1;
        this.isdetails = _router.url.indexOf("/details") > -1;

        this.getStudentFeesHistory();
    }

    public ngOnInit() {

    }

    getStudentFeesHistory() {
        let addeditFeesDT = JSON.parse(Cookie.get("addeditfees"));

        if (addeditFeesDT !== null) {
            this.getStudentDetails(addeditFeesDT);

            if (this.isedit) {
                this.getFeesCollection(addeditFeesDT);
            }
            else {
                this.resetSaveFees();
                this.resetFeesCollection();
            }
        }
        else {
            this.resetSaveFees();
            this._router.navigate(['/transaction/feescollection']);
        }
    }

    // Get Student Details

    getStudentDetails(row) {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": row.ayid, "classid": row.classid, "receivedate": row.receivedate,
            "studid": row.studid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.studid = data.data[0].studid;
                    that.studname = data.data[0].studname;
                    that.studphoto = data.data[0].studphoto;
                    that.ayid = data.data[0].ayid;
                    that.classid = data.data[0].classid;
                    that.classcode = data.data[0].classcode;
                    that.classname = data.data[0].classname;
                    that.gndrkey = data.data[0].gndrkey;
                    that.gndrval = data.data[0].gndrval;
                    that.rollno = data.data[0].rollno;
                    that.classfees = data.data[0].classfees;
                    that.pendingfees = data.data[0].classfees - data.data[0].feescoll;
                    that.statusid = data.data[0].statusid;

                    that.fillCategoryAndPaymentModeDropDown();
                }
                else {
                    that.studid = 0;
                    that.studname = "";
                    that.studphoto = "";
                    that.ayid = 0;
                    that.classid = 0;
                    that.classcode = 0;
                    that.classname = "";
                    that.gndrkey = "";
                    that.gndrval = "";
                    that.rollno = "";
                    that.classfees = "";
                    that.pendingfees = "";
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
            "flag": "fees", "catid": that.catid, "scatid": that.scatid, "classid": that.classid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.catfees = data.data[0].fees;
                    that.fees = data.data[0].fees;
                }
                else {
                    that.catfees = 0;
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

    // Reset Save Fees

    resetSaveFees() {
        var that = this;

        that.fclid = 0;
        that.catid = 0;
        that.scatid = 0;
        that.fees = 0;
        that.classfees = 0;
        that.pendingfees = 0;
        that.receivedate = "";
        that.paymentmode = "";
        that.chequestatus = "";
        that.chequeno = 0;
        that.chequedate = null;
        that.remark = "";
    }

    // Get Fees Collection

    getFeesCollection(row) {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "history", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": row.ayid, "classid": row.classid,
            "studid": row.studid, "paymentmode": row.paymentmode, "receiptno": row.receiptno, "receivedate": row.receivedate,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.receivedate = data.data[0].editrecvdate;
                    that.paymentmode = data.data[0].paymodecode;

                    if (that.paymentmode == "cheque") {
                        that.chequestatus = data.data[0].chequestatus;
                        that.chequeno = data.data[0].chequeno;
                        that.chequedate = data.data[0].editchqdate;
                    }
                    else {
                        that.chequestatus = "";
                        that.chequeno = 0;
                        that.chequedate = "";
                    }

                    that.remark = data.data[0].remark1;
                    that.studentFeesDT = data.data[0].catdetails;
                }
                else {
                    that.resetFeesCollection();
                    that.resetSaveFees();
                    that.studentFeesDT = [];
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

    // Valid Add Fees Collection

    isValidAddFees() {
        var that = this;

        if (that.catid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Category");
            $(".catname").focus();

            return false;
        }

        if (that.fees == "") {
            that._msg.Show(messageType.error, "Error", "Enter Fees");
            $(".fees").focus();

            return false;
        }

        if (that.fclid == 0) {
            if (parseInt(that.catfees) < parseInt(that.fees)) {
                that._msg.Show(messageType.info, "Info", "Should Be Enter Fees Less Than / Equal " + that.catfees);
                $(".fees").focus();

                return false;
            }
        }

        for (var i = 0; i < that.studentFeesDT.length; i++) {
            var _studfees = that.studentFeesDT[i];

            if (that.catid == _studfees.catid && that.scatid == _studfees.scatid) {
                that._msg.Show(messageType.warn, "Warning", "Duplicate Record Not Allowed !!!!");

                return false;
            }
        }

        return true;
    }

    // Reset Add Fees

    resetFeesCollection() {
        var that = this;

        that.fclid = 0;
        that.catid = 0;
        that.scatid = 0;
        that.fees = 0;

        that.isaddfees = true;
        that.iseditfees = false;
    }

    // Add Fees Collection

    addFeesCollection() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidAddFees();

        if (isvalid) {
            var catname = $("#ddlcatname option:selected").text().trim();
            var scatname = $("#ddlscatname option:selected").text().trim();

            that.studentFeesDT.push({
                "fclid": "0", "catid": that.catid, "catname": catname,
                "scatid": that.scatid, "scatname": scatname, "fees": that.fees,
                "isactive": true
            });

            that.resetFeesCollection();
        }
    }

    // Edit Fees Collection

    editFeesCollection(row) {
        var that = this;
        commonfun.loader();

        try {
            that.selectedFees = row;
            that.isaddfees = false;
            that.iseditfees = true;

            that.fclid = row.fclid;
            that.catid = row.catid;
            that.fillSubCateogryDropDown();
            that.scatid = row.scatid;
            that.fees = row.fees;

            commonfun.loaderhide();
        }
        catch (e) {
            that._msg.Show(messageType.error, "Error", e);
            commonfun.loaderhide();
        }
    }

    // Edit Fees Collection

    updateFeesCollection() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidAddFees();

        if (isvalid) {
            var catname = $("#ddlcatname option:selected").text().trim();
            var scatname = $("#ddlscatname option:selected").text().trim();

            that.isedit = false;
            that.selectedFees.fclid = that.fclid;
            that.selectedFees.catid = that.catid;
            that.selectedFees.catname = catname;
            that.selectedFees.scatid = that.scatid;
            that.selectedFees.scatname = scatname;
            that.selectedFees.fees = that.fees;
            that.resetFeesCollection();
            that.selectedFees = [];
        }
    }

    // Delete Stops List

    deleteFeesCollection(row) {
        row.isactive = false;
    }

    // Valid Save Fees Collection

    isValidSaveFees() {
        var that = this;

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
            if (that.chequestatus == "") {
                that._msg.Show(messageType.info, "Info", "Select Cheque Status");
                $(".chequestatus").focus();
                return false;
            }
            if (that.chequeno == 0) {
                that._msg.Show(messageType.info, "Info", "Enter Cheque No");
                $(".chequeno").focus();
                return false;
            }
            if (that.chequedate == null) {
                that._msg.Show(messageType.info, "Info", "Enter Cheque Date");
                $(".chequedate").focus();
                return false;
            }
        }

        if (that.studentFeesDT.length == 0) {
            that._msg.Show(messageType.info, "Info", "Fill Atleast 1 Fees Details");
            return false;
        }

        return true;
    }

    // Save Fees Collection

    saveFeesCollection() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidSaveFees();

        if (isvalid) {
            commonfun.loader();

            var savefeescoll = {
                "fclid": that.fclid,
                "ayid": that.ayid,
                "clsid": that.classid,
                "studid": that.studid,
                "receivedate": that.receivedate,
                "paymentmode": that.paymentmode,
                "chequestatus": that.chequestatus,
                "chequeno": that.chequeno,
                "chequedate": that.chequedate,
                "remark": that.remark,
                "studentfees": that.studentFeesDT,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode,
                "isactive": true
            }

            that._feesservice.saveFeesCollection(savefeescoll).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_feescollection;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var docno = dataResult.docno;

                    if (msgid != "-1") {
                        if (msgid == "1") {
                            if (that.isadd) {
                                that._autoservice.messagebox("Saved Successfully !!!!", "Your Receipt No : " + docno, "success", false);
                            }
                            else {
                                that._autoservice.messagebox("Updated Successfully !!!!", "", "success", false);
                            }

                            that.resetSaveFees();
                            that.studentFeesDT = [];

                            that.getStudentFeesHistory();
                            that.viewFeesCollection();
                        }
                        else {
                            that._msg.Show(messageType.error, "Error", msg);
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

    totalFees() {
        var that = this;
        var field: any = [];

        var totalfees = 0;

        for (var i = 0; i < that.studentFeesDT.length; i++) {
            field = that.studentFeesDT[i];
            totalfees += parseFloat(field.fees);
        }

        return totalfees;
    }

    // Back For View Data

    viewFeesCollection() {
        Cookie.delete("filterStudent");

        var studrow = {
            "ayid": this.ayid, "classid": this.classid, "studid": this.studid
        }

        Cookie.set("filterStudent", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/history']);
    }

    backViewData() {
        if (this.isedit) {
            this.viewFeesCollection();
        }
        else {
            this._router.navigate(['/transaction/feescollection']);
        }
    }
}
