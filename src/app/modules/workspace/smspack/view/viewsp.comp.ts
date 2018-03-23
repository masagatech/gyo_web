import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { SMSPackService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewsp.comp.html'
})

export class ViewSMSPackComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];
    _enttdetails: any = [];

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";
    selectedEntity: any = [];

    private defaultDate: string = "";
    smspackDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _spservice: SMSPackService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        this.viewSMSPackDataRights();
    }

    public ngOnInit() {
        
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "utype": this.loginUser.utype,
            "wsautoid": this._wsdetails.wsautoid,
            "issysadmin": this._wsdetails.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.entityDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Entity

    selectEntityData(event) {
        this.enttid = event.value;
        this.enttname = event.label;

        Cookie.set("_enttid_", event.value);
        Cookie.set("_enttnm_", event.label);

        this.getSMSPackGrid();
    }

    public viewSMSPackDataRights() {
        var that = this;

        if (Cookie.get('_enttnm_') != null) {
            that.enttid = parseInt(Cookie.get('_enttid_'));
            that.enttname = Cookie.get('_enttnm_');
        }
        else {
            that.enttid = that._enttdetails.enttid;
            that.enttname = that._enttdetails.enttname;
        }

        that.selectedEntity = {
            value: that.enttid,
            label: that.enttname
        }

        that.getSMSPackGrid();
    }

    resetSMSPackGrid() {
        Cookie.delete('_enttid_');
        Cookie.delete('_enttnm_');
        Cookie.delete('_srcutype_');

        this.enttid = 0;
        this.enttname = "";
        this.selectedEntity = [];

        this.getSMSPackGrid();
    }

    getSMSPackGrid() {
        var that = this;

        commonfun.loader();

        that._spservice.getSMSPack({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "enttid": that.enttid, "wsautoid": that._wsdetails.wsautoid
        }).subscribe(data => {
            try {
                that.smspackDT = data.data;
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

    public addSMSPack() {
        this._router.navigate(['/workspace/smspack/add']);
    }

    public editSMSPack(row) {
        this._router.navigate(['/workspace/smspack/edit', row.packid]);
    }
}