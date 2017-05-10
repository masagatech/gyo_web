import { Component, OnInit } from '@angular/core';
import { MessageService, messageType } from '../../../_services/messages/message-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../../_services/menus/menu-service';
import { LoginService } from '../../../_services/login/login-service';
import { LoginUserModel } from '../../../_model/user_model';
import { SchoolService } from '../../../_services/school/school-service';

@Component({
    templateUrl: 'viewschool.comp.html',
    providers: [MenuService, SchoolService]
})

export class ViewSchoolComponent implements OnInit {
    schoolDT: any = [];
    loginUser: LoginUserModel;

    actaddrights: string = "";
    acteditrights: string = "";
    actviewrights: string = "";

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        public _menuservice: MenuService, private _loginservice: LoginService, private _schoolservice: SchoolService) {
        this.loginUser = this._loginservice.getUser();
        this.viewSchoolDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewSchoolDataRights() {
        var that = this;
        var addRights = [];
        var editRights = [];
        var viewRights = [];

        that._menuservice.getMenuDetails({
            "flag": "actrights", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "mcode": "sch"
        }).subscribe(data => {
            addRights = data.data.filter(a => a.mrights === "add");
            editRights = data.data.filter(a => a.mrights === "edit");
            viewRights = data.data.filter(a => a.mrights === "view");

            that.actaddrights = addRights.length !== 0 ? addRights[0].mrights : "";
            that.acteditrights = editRights.length !== 0 ? editRights[0].mrights : "";
            that.actviewrights = viewRights.length !== 0 ? viewRights[0].mrights : "";

            that.getSchoolDetails();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
        }, () => {

        })
    }

    getSchoolDetails() {
        var that = this;

        if (that.actviewrights === "view") {
            commonfun.loader();

            that._schoolservice.getSchoolDetails({ "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype }).subscribe(data => {
                try {
                    that.schoolDT = data.data;
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
    }

    public addSchoolForm() {
        this._router.navigate(['/school/add']);
    }

    public editSchoolForm(row) {
        this._router.navigate(['/school/edit', row.autoid]);
    }
}
