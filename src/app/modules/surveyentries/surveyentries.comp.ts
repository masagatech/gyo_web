import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../_services/menus/menu-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';
import { DriverInfoService } from '../../_services/driverinfo/driverinfo-service';
import { LazyLoadEvent } from 'primeng/primeng';

declare var $: any;

@Component({
    templateUrl: './surveyentries.comp.html',
    providers: [DriverInfoService]
})

export class SurveyEntriesComp implements OnInit {
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    datatable_datasource: any = [];
    datatable_totalRecords: number = 0;

    constructor(private _route: Router, private _msg: MessageService, public _menuservice: MenuService, private _loginservice: LoginService,
        private _driverinfoservice: DriverInfoService) {
        this.loginUser = this._loginservice.getUser();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewSurveyDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({ "flag": "actrights", "uid": that.loginUser.uid, "mid": "2", "utype": that.loginUser.utype }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    getGridData(from: number, to: number) {
        var that = this;

        $(".datagrid").waitMe({
            effect: 'pulse',
            text: 'Loading...',
            bg: 'rgba(255,255,255,0.90)',
            color: 'amber'
        });

        that._driverinfoservice.getDriverInfoGrid({ "from": from, "to": to }).subscribe(_d => {
            that.datatable_totalRecords = _d.data[1][0].recordstotal;
            that.datatable_datasource = _d.data[0];
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {
            $(".datagrid").waitMe('hide');
        })
    }

    lazy_load(event: LazyLoadEvent) {
        this.getGridData(event.first, (event.first + event.rows));
    }

    showDetails(row: any) {
        console.log(row);
        var id = row.autoid;
        this._route.navigate(["/surveyentries/details/", id]);
    }
}
