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

    receiptbookDT: any = [];
    paymentmodeDT: any = [];
    categoryDT: any = [];
    subCategoryDT: any = [];

    // Default Fields

    fclid: number = 0;
    classfees: any = "";
    pendingfees: any = "";

    // Student Fields

    enttid: number = 0;
    enttname: string = "";
    ayid: number = 0;
    ayname: string = "";
    studid: number = 0;
    studname: string = "";
    studphoto: string = "";
    classid: number = 0;
    classcode: number = 0;
    classname: string = "";
    gndrkey: string = "";
    gndrval: string = "";
    rollno: string = "";

    // Fees Collection Fields

    rbid: number = 0;
    rbname: string = "";
    receiptno: number = 0;
    receivedate: any = "";
    paymodecode: string = "";
    paymodename: string = "";
    chequestatus: string = "";
    chequestatusnm: string = "";
    chequeno: number = 0;
    chequedate: any = null;
    remark: string = "";
    statusid: number = 0;

    catid: number = 0;
    scatid: number = 0;
    catfees: any = "";
    fees: any = "";

    studsFilterDT: any = [];
    studentFeesDT: any = [];
    saveStudentFeesDT: string = "[]";
    selectedFees: any = {};
    isaddfees: boolean = false;
    iseditfees: boolean = false;

    fltr_recvdate: string = "";
    fltr_rpttype: string = "";

    isadd: boolean = false;
    isedit: boolean = false;
    isdetails: boolean = false;

    feesData: any = {};
    oldFeesData: any = [];
    newFeesData: any = [];

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
            "studid": row.studid, "enttid": row.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.studid = data.data[0].studid;
                    that.studname = data.data[0].studname;
                    that.studphoto = data.data[0].studphoto;
                    that.enttid = data.data[0].enttid;
                    that.enttname = data.data[0].enttname;
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

                    that.fillDropDownList();
                }
                else {
                    that.studid = 0;
                    that.studname = "";
                    that.studphoto = "";
                    that.enttid = that._enttdetails.enttid;
                    that.enttname = that._enttdetails.enttname;
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

    // Fill Receipt Book, Payment Mode And Cateogry

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "dropdown", "classid": that.classid, "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.receiptbookDT = data.data.filter(a => a.group == "receiptbook");
                that.paymentmodeDT = data.data.filter(a => a.group == "paymentmode");
                that.categoryDT = data.data.filter(a => a.group == "category");
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
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid
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

    getFeesStructure() {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "fees", "catid": that.catid, "scatid": that.scatid, "classid": that.classid,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid
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
        that.rbid = 0;
        that.receivedate = "";
        that.paymodecode = "";
        that.paymodename = "";
        that.chequestatus = "";
        that.chequestatusnm = "";
        that.chequeno = 0;
        that.chequedate = null;
        that.catid = 0;
        that.scatid = 0;
        that.fees = 0;
        that.classfees = 0;
        that.pendingfees = 0;
        that.remark = "";
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
                "scatid": that.scatid, "scatname": scatname == "Select Sub Category" ? "" : scatname,
                "fees": that.fees, "isactive": true
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

        if (that.iseditfees == true) {
            isvalid = true;
        }
        else {
            isvalid = that.isValidAddFees();
        }

        if (isvalid) {
            var catname = $("#ddlcatname option:selected").text().trim();
            var scatname = $("#ddlscatname option:selected").text().trim();

            that.isedit = false;
            that.selectedFees.fclid = that.fclid;
            that.selectedFees.catid = that.catid;
            that.selectedFees.catname = catname;
            that.selectedFees.scatid = that.scatid;
            that.selectedFees.scatname = scatname == "Select Sub Category" ? "" : scatname;
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

    isValidSaveFees(newval) {
        var that = this;

        if (that.rbid == 0) {
            that._msg.Show(messageType.info, "Info", "Select Receipt Book");
            $(".rbname").focus();
            return false;
        }

        if (that.receivedate == "") {
            that._msg.Show(messageType.info, "Info", "Enter Receive Date");
            $(".receivedate").focus();
            return false;
        }

        if (that.paymodecode == "") {
            that._msg.Show(messageType.info, "Info", "Select Payment Mode");
            $(".paymentmode").focus();
            return false;
        }

        if (that.paymodecode == "cheque") {
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

        if (that.isedit) {
            if (JSON.stringify(newval) == "{}") {
                that._msg.Show(messageType.warn, "Warning", "No any Changes");
                return false;
            }
        }

        return true;
    }

    // Get Audit Parameter

    getAuditData() {
        var that = this;

        var _auditdt = [];
        var field = null;

        _auditdt = [
            { "key": "Academic Year", "val": that.ayname, "fldname": "ayid", "fldtype": "label" },
            { "key": "Class Name", "val": that.classname, "fldname": "clsid", "fldtype": "label" },
            { "key": "Student Name", "val": that.studname, "fldname": "studid", "fldtype": "label" },
            { "key": "Receipt Book", "val": that.rbname, "fldname": "rbid", "fldtype": "ddl" },
            { "key": "Receipt No", "val": that.receiptno, "fldname": "docno", "fldtype": "label" },
            { "key": "Receive Date", "val": that.receivedate, "fldname": "receivedate", "fldtype": "date" },
            { "key": "Payment Mode", "val": that.paymodename, "fldname": "paymentmode", "fldtype": "ddl" },
            { "key": "Cheque Status", "val": that.chequestatusnm, "fldname": "chequestatus", "fldtype": "ddl" },
            { "key": "Cheque No", "val": that.chequeno, "fldname": "chequeno", "fldtype": "text" },
            { "key": "Cheque Date", "val": that.chequedate, "fldname": "chequedate", "fldtype": "date" },
            { "key": "Remark", "val": that.remark, "fldname": "remark", "fldtype": "text" },

            // Upload Student Fees

            { "key": "Student Fees", "val": that.saveStudentFeesDT, "fldname": "studentfees", "fldtype": "table" },
        ]

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldFeesData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newFeesData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var dispflds = [{ "key": "Student Name", "val": name }, { "key": "Receipt No", "val": that.receiptno }];

        var auditparams = {
            "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": "studentfees", "mdlname": "Student Fees",
            "id": id, "dispflds": dispflds, "oldval": _oldvaldt, "newval": _newvaldt, "ayid": that.ayid,
            "enttid": that.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
        };

        that._autoservice.saveAuditLog(auditparams);
    }

    // Get Save Parameter

    getFeesParams() {
        var that = this;

        var params = {
            "fclid": that.fclid,
            "ayid": that.ayid,
            "clsid": that.classid,
            "studid": parseInt("" + that.studid),
            "rbid": that.rbid,
            "docno": that.receiptno,
            "receivedate": that.receivedate,
            "paymentmode": that.paymodecode,
            "chequestatus": that.chequestatus,
            "chequeno": that.chequeno,
            "chequedate": that.chequedate,
            "remark": that.remark,
            "studentfees": that.saveStudentFeesDT,
            "enttid": that.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "cuid": that.loginUser.ucode,
            "isactive": true
        }

        return params;
    }

    // Save Fees Collection

    saveFeesCollection() {
        var that = this;
        var isvalid = false;

        that.saveStudentFeesDT = JSON.stringify(that.studentFeesDT);

        var params = that.getFeesParams();
        that.newFeesData = that.getAuditData();

        var newval = that._autoservice.getDiff2Arrays(that.feesData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.feesData);

        isvalid = that.isValidSaveFees(newval);

        if (isvalid) {
            commonfun.loader();

            that._feesservice.saveFeesCollection(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_feescollection;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var docno = dataResult.docno;

                    if (msgid != "-1") {
                        if (msgid == "1") {
                            if (that.isadd) {
                                that._autoservice.messagebox("Fees created Successfully !!!!", "Your Receipt No : " + docno, "success", false);
                            }
                            else {
                                that.saveAuditLog(that.studid, that.studname, oldval, newval);
                                that._autoservice.messagebox("Fees updated Successfully !!!!", "", "success", false);

                                that.backViewData();
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

    // Get Fees Collection

    getFeesCollection(row) {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "history", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": row.ayid, "classid": row.classid,
            "studid": row.studid, "paymentmode": row.paymentmode, "receiptno": row.receiptno, "receivedate": row.receivedate,
            "enttid": row.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.isaddfees = true;
                    that.iseditfees = false;

                    that.ayid = data.data[0].ayid;
                    that.classid = data.data[0].clsid;
                    that.studid = data.data[0].studid;
                    that.rbid = data.data[0].rbid;
                    that.receiptno = data.data[0].receiptno;
                    that.receivedate = data.data[0].editrecvdate;
                    that.paymodecode = data.data[0].paymodecode;
                    that.paymodename = data.data[0].paymodename;

                    if (that.paymodecode == "cheque") {
                        that.chequestatus = data.data[0].chequestatus;
                        that.chequestatusnm = data.data[0].chequestatusnm;
                        that.chequeno = data.data[0].chequeno;
                        that.chequedate = data.data[0].editchqdate;
                    }
                    else {
                        that.chequestatus = "";
                        that.chequestatusnm = "";
                        that.chequeno = 0;
                        that.chequedate = "";
                    }

                    that.remark = data.data[0].remark1;
                    that.studentFeesDT = data.data[0].catdetails;
                    that.saveStudentFeesDT = JSON.stringify(that.studentFeesDT);
                }
                else {
                    that.resetFeesCollection();
                    that.resetSaveFees();
                    that.studentFeesDT = [];
                    that.saveStudentFeesDT = "[]";
                }

                that.feesData = that.getFeesParams();
                that.oldFeesData = that.getAuditData();
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
        var field = null;

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
            "enttid": this.enttid, "ayid": this.ayid, "classid": this.classid, "studid": this.studid
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
