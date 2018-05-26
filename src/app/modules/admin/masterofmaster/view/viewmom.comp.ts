import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'viewMOM.comp.html',
    providers: [CommonService]
})

export class ViewMOMComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    momDT: any = [];
    grpcd: string = "";
    headertitle: string = "";
    mtype: string = "";
    isdynmenu: boolean = false;

    private subscribeParameters: any;

    enttid: number = 0;
    wsautoid: number = 0;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _loginservice: LoginService,
        private _commonservice: CommonService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        if (Cookie.get("_schenttdetails_") == null && Cookie.get("_schenttdetails_") == undefined) {
            if (Cookie.get("_schwsdetails_") == null && Cookie.get("_schwsdetails_") == undefined) {
                this.enttid = 0;
                this.wsautoid = 0;
            }
            else {
                this.enttid = this._wsdetails.enttid;
                this.wsautoid = this._wsdetails.wsautoid;
            }
        }
        else {
            this.enttid = this._enttdetails.enttid;
            this.wsautoid = this._enttdetails.wsautoid;
        }

        this.getMOMGroup();
    }

    ngOnInit() {

    }

    getMOMGroup() {
        var that = this;

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['grpcd'] !== undefined) {
                that.grpcd = params['grpcd'];

                that._commonservice.getMOM({ "flag": "group", "grpcd": that.grpcd }).subscribe(data => {
                    try {
                        if (data.data.length > 0) {
                            that.headertitle = data.data[0].grpnm;
                            that.mtype = data.data[0].typ;
                            that.isdynmenu = data.data[0].isdynmenu;
                            that.getMOMDetails();
                        }
                        else {
                            that.headertitle = "";
                            that.mtype = "";
                            that.isdynmenu = false;
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
        });
    }

    getMOMDetails() {
        var that = this;

        that._commonservice.getMOM({
            "flag": "grid", "group": that.grpcd, "enttid": that.enttid, "wsautoid": that.wsautoid
        }).subscribe(data => {
            try {
                if (data.data.length > 0) {
                    that.momDT = data.data;
                }
                else {
                    that.momDT = [];
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

    public addMOMForm() {
        if (this.mtype == "all") {
            this._router.navigate(['/admin/master', this.grpcd, 'add']);
        }
        else {
            this._router.navigate(['/master/other', this.grpcd, 'add']);
        }
    }

    public editMOMForm(row) {
        if (this.mtype == "all") {
            this._router.navigate(['/admin/master', this.grpcd, 'edit', row.autoid]);
        }
        else {
            this._router.navigate(['/master/other', this.grpcd, 'edit', row.autoid]);
        }
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}