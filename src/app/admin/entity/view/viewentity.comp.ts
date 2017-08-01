import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewentity.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewEntityComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    autoEntityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    entttypeDT: any = [];
    entttype: string = "";

    entityDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _entityservice: EntityService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        if (this._wsdetails == null && this._wsdetails == undefined) {
            this._router.navigate(['/workspace']);
        }

        this.fillDropDownList();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "dropdown", "wscode": that._wsdetails.wscode }).subscribe(data => {
            try {
                that.entttypeDT = data.data.filter(a => a.group === "workspace");
                setTimeout(function () { $.AdminBSB.select.refresh('entttype'); }, 100);

                if (that.entttypeDT.length == 1) {
                    that.entttype = that.entttypeDT[0].key;
                }
                else {
                    that.entttypeDT.splice(0, 0, { "key": "", "val": "Select Entity Type" });

                    if (Cookie.get('_entttype_') != null) {
                        that.entttype = Cookie.get('_entttype_');
                    }
                    else {
                        that.entttype = "";
                    }

                    that.getEntityDetails();
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

    isshEntity(viewtype) {
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

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
            "search": query
        }).subscribe((data) => {
            this.autoEntityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        this.getEntityDetails();
    }

    getEntityDetails() {
        var that = this;
        var params = {};

        Cookie.set("_entttype_", this.entttype);
        this.entttype = Cookie.get('_entttype_');

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": that.entttype, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid, "enttid": that.enttid
        }

        console.log(params);

        that._entityservice.getEntityDetails(params).subscribe(data => {
            try {
                that.entityDT = data.data;
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

    resetEntityDetails() {
        Cookie.delete('_entttype_');
        this.entttype = "";
        this.enttid = 0;
        this.enttname = "";
        this.getEntityDetails();
    }

    public addEntityForm() {
        this._router.navigate(['/master/entity/add']);
    }

    public editEntityForm(row) {
        this._router.navigate(['/master/entity/edit', row.autoid]);
    }

    public openMainForm(row) {
        Cookie.delete("_schenttdetails_");

        console.log(row);

        Cookie.set("_schenttdetails_", JSON.stringify(row));
        this._router.navigate(['/']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
