import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { PassengerService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var $: any;

@Component({
    templateUrl: 'viewpsngr.comp.html'
})

export class ViewPassengerComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    isShowGrid: boolean = true;
    isShowList: boolean = false;
    status: string = "";

    autoPassengerDT: any = [];
    psngrid: number = 0;
    psngrname: any = [];

    passengerDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _psngrservice: PassengerService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

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

        this._autoservice.getERPAutoData({
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

    // View Data Rights

    public viewPassengerDataRights() {
        var that = this;

        if (Cookie.get('_psngrnm_') != null) {
            that.psngrid = parseInt(Cookie.get('_psngrid_'));
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
            "psngrid": that.psngrid.toString() == "" ? 0 : that.psngrid, "status": that.status, "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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
        this._router.navigate(['/master/' + this._enttdetails.smpsngrtype + '/edit', row.psngrid]);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
