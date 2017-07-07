import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { UserService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { LazyLoadEvent } from 'primeng/primeng';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import jsPDF from 'jspdf'

declare var $: any;

@Component({
    templateUrl: 'rptuser.comp.html',
    providers: [CommonService]
})

export class UserReportsComponent implements OnInit, OnDestroy {
    autoUserDT: any = [];

    autouid: number = 0;
    autouname: string = "";

    utypeDT: any = [];
    srcutype: string = "";

    usersDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    @ViewChild('users') users: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _autoservice: CommonService, private _loginservice: LoginService, private _userservice: UserService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillUserTypeDropDown();
        this.viewUserDataRights();
    }

    public ngOnInit() {
        var that = this;

        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Export

    public exportToCSV() {
        new Angular2Csv(this.usersDT, 'UserReports', { "showLabels": true });
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.users.nativeElement, 0, 0, options, () => {
            pdf.save("UserReports.pdf");
        });
    }

    // Fill Dropdown

    fillUserTypeDropDown() {
        var that = this;
        commonfun.loader();

        that._userservice.getUserDetails({ "flag": "dropdown", "utype": that.loginUser.utype }).subscribe(data => {
            that.utypeDT = data.data;
            commonfun.loaderhide();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Auto Completed User

    getAutoUsers(event) {
        var that = this;
        let query = event.query;

        that._autoservice.getAutoData({
            "flag": "allusers",
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin,
            "wsautoid": that._wsdetails.wsautoid,
            "srcutype": that.srcutype,
            "search": query
        }).subscribe(data => {
            that.autoUserDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected User

    selectAutoUsers(event, arg) {
        var that = this;

        that.autouid = event.uid;
        that.autouname = event.uname;

        that.getUserDetails();
    }

    public viewUserDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "mcode": "usr", "utype": that.loginUser.utype
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            if (Cookie.get('_srcutype_') != null) {
                that.srcutype = Cookie.get('_srcutype_');
                that.getUserDetails();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getUserDetails() {
        var that = this;
        var uparams = {};

        if (that.actviewrights === "view") {
            Cookie.set("_srcutype_", that.srcutype);
            that.srcutype = Cookie.get('_srcutype_');

            commonfun.loader("#users");

            uparams = {
                "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "srcutype": that.srcutype,
                "srcuid": that.autouid
            };

            that._userservice.getUserDetails(uparams).subscribe(data => {
                try {
                    that.usersDT = data.data;
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }

                commonfun.loaderhide("#users");
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide("#users");
            }, () => {

            })
        }
    }

    resetUserDetails() {
        Cookie.delete('_srcutype_');
        this.srcutype = "";
        this.autouid = 0;
        this.autouname = "";
        this.getUserDetails();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
