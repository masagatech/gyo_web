import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewpsngr.comp.html',
    providers: [CommonService]
})

export class ViewPassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    classDT: any = [];
    classid: number = 0;

    autoPassengerDT: any = [];
    psngrdata: any = [];
    psngrid: number = 0;
    psngrname: string = "";

    passengerDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
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
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
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

        that._psngrservice.getPassengerDetails({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.classDT = data.data.filter(a => a.group === "class");
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
            that.psngrid = parseInt(Cookie.get('_psngrid_'));
            that.psngrname = Cookie.get('_psngrnm_');

            that.psngrdata.value = that.psngrid;
            that.psngrdata.label = that.psngrname;
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

            that.psngrdata.value = parseInt(Cookie.get('_psngrid_'));
            that.psngrdata.label = Cookie.get('_psngrnm_');
        }

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "psngrid": that.psngrid.toString() == "" ? 0 : that.psngrid, "classid": that.classid,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        };

        that._psngrservice.getPassengerDetails(params).subscribe(data => {
            try {
                that.passengerDT = data.data;
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
