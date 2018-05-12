import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals, Common } from '@models';
import { NotificationService, FeesService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'history.comp.html'
})

export class ViewFeesHistoryComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    feesHistoryDT: any = [];
    studsFilterDT: any = [];

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

    fltr_recvdate: string = "";
    fltr_rpttype: string = "";

    private subscribeParameters: any;

    constructor(private _ntfservice: NotificationService, private _feesservice: FeesService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getStudentFeesHistory();
    }

    public ngOnInit() {

    }

    getStudentFeesHistory() {
        let studsFilterDT = JSON.parse(Cookie.get("filterStudent"));

        if (studsFilterDT !== null) {
            this.getStudentDetails(studsFilterDT);
            this.getFeesCollection(studsFilterDT);
        }
        else {
            this._router.navigate(['/transaction/feescollection']);
        }
    }

    editFeesCollection(row) {
        Cookie.delete("filterStudent");

        var _ayid = row.key.split('~')[0];
        var _classid = row.key.split('~')[1];
        var _studid = row.key.split('~')[2];
        var _receiptno = row.key.split('~')[3];
        var _receivedate = row.key.split('~')[4];

        var studrow = {
            "ayid": _ayid, "classid": _classid, "studid": _studid, "receiptno": _receiptno, "receivedate": _receivedate
        }

        Cookie.set("filterStudent", JSON.stringify(studrow));
        this._router.navigate(['/transaction/feescollection/student/edit']);
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
                    that.pendingfees = data.data[0].classfees - that.totalFees();
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

    // Download Fees Sleep

    getFeesReports(rpttype, type, row) {
        var that = this;

        if (type == "all") {
            that.fltr_recvdate = "";
        }
        else {
            that.fltr_recvdate = row.key.split('~')[4];
        }

        that.fltr_rpttype = rpttype;

        var feesparams = {
            "flag": "receipt", "rpttype": that.fltr_rpttype, "ayid": that.ayid, "stdid": that.classid, "classid": "",
            "frmdt": that.fltr_recvdate, "todt": that.fltr_recvdate, "studid": that.studid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "format": "html"
        }

        var url = Common.getReportUrl("getFeesReports", feesparams);

        $("#feesReportsModal").modal('show');

        commonfun.loader("#feesreports");
        $("#ifeesreports")[0].src = url;
        commonfun.loaderhide("#feesreports");
    }

    // Save Notification

    saveNotification(flag, typ, row) {
        var that = this;
        var _receivedate = "";
        var _datehead = "";

        if (typ == "all") {
            _receivedate = "";
            _datehead = "";
        }
        else {
            _receivedate = row.key.split('~')[4];
            _datehead = "of Date : " + row.key.split('~')[4];
        }

        commonfun.loader();

        var feesparams = {
            "flag": flag, "typ": typ, "ayid": that.ayid, "stdid": that.classid, "classid": "", "receivedate": _receivedate,
            "studid": that.studid, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "format": "pdf"
        }

        var _mailmsg = "";

        _mailmsg += "<p>Name : " + that.studname + "</p>";
        _mailmsg += "<p>Roll No : " + that.rollno + "</p>";
        _mailmsg += "<p>Standard : " + that.classname + "</p>";
        _mailmsg += "<p>See, Attachment File, Fees Sleep of your child " + _datehead + ".</p>";

        var _path = Common.getReportUrl("getFeesReports", feesparams);
        var _attachments = [{ "filename": that.studname + " Fees.pdf", "path": _path, "contentType": "application/pdf", "orientation": "portrait" }];

        var ntfparams = {
            "ntfid": 0,
            "ntftype": "studentfees",
            "title": "Student Fees : " + that.studname,
            "msg": "Sent Email, on your registered email, to Fees Sleep of your child - " + that.studname + " " + that.classname + " " + _receivedate + ". so, please check your email",
            "mailmsg": _mailmsg,
            "issendsms": false,
            "issendemail": true,
            "grpid": 170,
            "frmid": that.loginUser.uid,
            "frmtype": that.loginUser.utype,
            "issendparents": true,
            "issendteacher": false,
            "sendtype": "{parents}",
            "classid": "{" + that.classcode + "}",
            "studid": "{" + that.studid + "}",
            "tchrid": "{0}",
            "cuid": that.loginUser.ucode,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "attachments": _attachments
        }

        that._ntfservice.saveNotification(ntfparams).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_notification;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", "Mail send successfully !!!!");
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

    // Get Fees Collection

    getFeesCollection(row) {
        var that = this;
        commonfun.loader();

        that._feesservice.getFeesCollection({
            "flag": "history", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ayid": row.ayid, "classid": row.classid,
            "studid": row.studid, "receiptno": row.receiptno, "receivedate": row.receivedate,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.feesHistoryDT = data.data;
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

        for (var i = 0; i < that.feesHistoryDT.length; i++) {
            field = that.feesHistoryDT[i];
            totalfees += parseFloat(field.fees);
        }

        return totalfees;
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/feescollection']);
    }
}
