import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, MenuService, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { DriverService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewdriver.comp.html',
    providers: [MenuService, CommonService]
})

export class ViewDriverComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    global = new Globals();

    driverDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    emptymsg: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService, public _menuservice: MenuService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _driverservice: DriverService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.viewDriverDataRights();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();
        }, 100);
    }

    isshDriver(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewDriverDataRights() {
        var that = this;

        if (that._enttdetails.enttname != null) {
            that.enttid = parseInt(this._enttdetails.enttid);
            that.enttname = this._enttdetails.enttname;
            that.getDriverDetails();
        }
        else {
            that.emptymsg = "Search Entity";
        }
    }

    getDriverDetails() {
        var that = this;

        commonfun.loader();

        that._driverservice.getDriverDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.driverDT = data.data;
                }
                else {
                    that.driverDT = [];
                    that.emptymsg = "No records found";
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

    public addDriverForm() {
        this._router.navigate(['/master/driver/add']);
    }

    public editDriverForm(row) {
        this._router.navigate(['/master/driver/edit', row.autoid]);
    }
}
