import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/erp';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewemp.comp.html',
    providers: [CommonService]
})

export class ViewEmployeeComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    emptypeDT: any = [];
    emptype: string = "";

    employeeDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    emptymsg: string = "";

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _empservice: EmployeeService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getEmployeeDetails();
    }

    public ngOnInit() {
        
    }

    // Fill DropDown List

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._empservice.getEmployeeDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.emptypeDT = data.data.filter(a => a.group == "emptype");
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

    isshEmployee(viewtype) {
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

    getEmployeeDetails() {
        var that = this;
        var params = {};

        commonfun.loader();

        params = {
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype, "emptype": that.emptype,
            "enttid": that._enttdetails.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        }

        that._empservice.getEmployeeDetails(params).subscribe(data => {
            try {
                that.employeeDT = data.data;
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

    public addEmployeeForm() {
        this._router.navigate(['/erp/employee/add']);
    }

    public editEmployeeForm(row) {
        this._router.navigate(['/erp/employee/edit', row.empid]);
    }

    public viewEmployeeProfile(row) {
        this._router.navigate(['/erp/employee/profile', row.empid]);
    }
}
