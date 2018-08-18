import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';

@Component({
    templateUrl: 'viewentity.comp.html'
})

export class ViewEntityComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    autoEntityDT: any = [];
    enttid: number = 0;
    enttname: any = [];

    entttypeDT: any = [];
    entttype: string = "";

    entityDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, private _autoservice: CommonService,
        private _loginservice: LoginService, private _entityservice: EntityService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillDropDownList();

        if (sessionStorage.getItem("_entttype_") != null) {
            this.entttype = sessionStorage.getItem("_entttype_");
        }
        else {
            this.entttype = "";
        }

        this.getEntityDetails();
    }

    public ngOnInit() {

    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "dropdown", "wscode": that._wsdetails.wscode }).subscribe(data => {
            try {
                that.entttypeDT = data.data.filter(a => a.group === "workspace");

                if (that.entttypeDT.length == 1) {
                    that.entttype = that.entttypeDT[0].key;
                }
                else {
                    that.entttypeDT.splice(0, 0, { "key": "", "val": "All" });
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
        this.getEntityDetails();
    }

    getEntityDetails() {
        var that = this;
        var params = {};

        sessionStorage.setItem("_entttype_", that.entttype);
        that.entttype = sessionStorage.getItem("_entttype_");

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": that.entttype, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid,
            "schoolid": that._wsdetails.schoolid, "enttid": that.enttid
        }

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
        sessionStorage.removeItem('_entttype_');
        this.entttype = "";
        this.enttid = 0;
        this.enttname = [];
        this.getEntityDetails();
    }

    public addEntityForm() {
        this._router.navigate(['/workspace/entity/add']);
    }

    public editEntityForm(row) {
        this._router.navigate(['/workspace/entity/edit', row.autoid]);
    }

    public openMainForm(row) {
        if (row.isactive) {
            sessionStorage.removeItem("_schenttdetails_");
            sessionStorage.removeItem("_ayid_");

            sessionStorage.setItem("_schenttdetails_", JSON.stringify(row));
            this._router.navigate(['/']);
        }
        else {
            this._msg.Show(messageType.error, "Error", "This " + row.entttype + " is Deactive");
        }
    }

    public ngOnDestroy() {

    }
}
