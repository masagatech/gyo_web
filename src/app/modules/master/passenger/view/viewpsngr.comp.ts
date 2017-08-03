import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewpsngr.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewPassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    standardDT: any = [];
    standard: string = "";

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: any = [];

    passengerDT: any = [];
    emptymsg: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.viewPassengerDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            $(".enttname input").focus();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    isshPassenger(viewtype) {
        var that = this;
        commonfun.loader("#divShow");

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    // Auto Completed Passenger

    getPassengerData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "passenger",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "id": this._enttdetails.enttid,
            "search": query
        }).subscribe((data) => {
            this.autoPassengerDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Passenger

    selectPassengerData(event) {
        Cookie.set("_psngrid_", event.value);
        Cookie.set("_psngrnm_", event.label);

        this.getPassengerDetails();
    }

    // Fill Entity, Standard, Month DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._psngrservice.getPassengerDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group === "standard");
                setTimeout(function () { $.AdminBSB.select.refresh('standard'); }, 100);
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

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;

        if (Cookie.get('_psngrnm_') != null) {
            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrnm_');
        }

        that.getPassengerDetails();
    }

    getPassengerDetails() {
        var that = this;
        var params = {};

        commonfun.loader("#fltrpsngr");

        if (that.psngrid == 0) {
            Cookie.set("_psngrid_", "0");
            Cookie.set("_psngrnm_", "");

            that.psngrname.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrname.label = Cookie.get('_psngrnm_');
        }

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "schid": that._enttdetails.enttid, "stdid": that.psngrid.toString() == "" ? 0 : that.psngrid, "standard": that.standard,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        };

        that._psngrservice.getPassengerDetails(params).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.passengerDT = data.data;
                }
                else {
                    that.passengerDT = [];
                    that.emptymsg = "No records found";
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide("#fltrpsngr");
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide("#fltrpsngr");
        }, () => {

        })
    }

    public addPassengerForm() {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + '/add']);
    }

    public editPassengerForm(row) {
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + '/edit', row.autoid]);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
