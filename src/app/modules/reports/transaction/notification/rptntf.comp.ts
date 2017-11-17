import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { NotificationService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import jsPDF from 'jspdf';

@Component({
    templateUrl: 'rptntf.comp.html',
    providers: [CommonService]
})

export class NotificationReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    frmUsersDT: any = [];
    frmudata: any = [];
    frmuid: number = 0;
    frmuname: string = "";

    toUsersDT: any = [];
    toudata: any = [];
    touid: number = 0;
    touname: string = "";

    notificationDT: any = [];
    @ViewChild('notification') notification: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _ntfservice: NotificationService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.resetNotificationReports();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Auto Completed From User Name

    getFromUserData(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "users",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._enttdetails.wsautoid,
            "search": query
        }).subscribe(data => {
            that.frmUsersDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected From User Name

    selectFromUserData(event, arg) {
        var that = this;

        that.frmuid = event.loginid;
        that.frmuname = event.uname;

        that.getNotificationReports();
    }

    // Auto Completed To User Name

    getToUserData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "usrdrv",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "enttid": this._enttdetails.enttid,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._enttdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.toUsersDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected To User Name

    selectToUserData(event) {
        var that = this;

        that.touid = event.uid;
        that.touname = event.uname;

        that.getNotificationReports();
    }

    // Notification

    getNotificationReports() {
        var that = this;
        commonfun.loader();

        that._ntfservice.getNotification({
            "flag": "reports", "frmid": that.frmuid, "toid": that.touid, "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.notificationDT = data.data;
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

    resetNotificationReports() {
        this.frmuid = this.loginUser.loginid;
        this.frmuname = this.loginUser.utypename + " : " + this.loginUser.ucode + " - " + this.loginUser.fullname;
        this.frmudata.uid = this.frmuid;
        this.frmudata.uname = this.frmuname;

        this.touid = 0;
        this.touname = "";
        this.toudata = [];

        this.getNotificationReports();
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.notificationDT, "Notification Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.notification.nativeElement, 0, 0, options, () => {
            pdf.save("Notification Details.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
