import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';
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

    psngrtype: string = "";
    psngrtypenm: string = "";

    employeeDT: any = [];

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    emptymsg: string = "";

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

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
                that.emptypeDT = data.data.filter(a => a.group == "emptype").filter(a => a.key != "tchr");
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

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['psngrtype'] !== undefined) {
                that.psngrtype = params['psngrtype'];

                if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                }
                else {
                    that.psngrtypenm = 'Employee';
                }

                params = {
                    "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                    "emptype": that.psngrtype == "teacher" ? "tchr" : that.emptype, "enttid": that._enttdetails.enttid,
                    "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
                }

                that._empservice.getEmployeeDetails(params).subscribe(data => {
                    try {
                        if (that.psngrtype == "teacher") {
                            that.employeeDT = data.data;
                        }
                        else {
                            that.employeeDT = data.data.filter(a => a.emptype != "tchr");
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
            else {
                commonfun.loaderhide();
            }
        });
    }

    public addEmployeeForm() {
        this._router.navigate(['/erp/' + this.psngrtype + '/add']);
    }

    public editEmployeeForm(row) {
        this._router.navigate(['/erp/' + this.psngrtype + '/edit', row.empid]);
    }

    public viewEmployeeProfile(row) {
        this._router.navigate(['/erp/' + this.psngrtype + '/profile', row.empid]);
    }
}
