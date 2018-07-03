import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EmployeeService } from '@services/master';

declare var $: any;

@Component({
    templateUrl: 'viewprofile.comp.html'
})

export class ViewProfileComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    empid: number = 0;
    employeeDT: any = [];

    psngrtype: string = "";
    psngrtypenm: string = "";

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _empservice: EmployeeService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getEmployeeDetails();
    }

    public ngOnInit() {
        var that = this;
    }

    getEmployeeDetails() {
        var that = this;
        var uparams = {};

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

                if (params['id'] !== undefined) {
                    that.empid = params['id'];
                }
                else {
                    that.empid = that.loginUser.loginid;
                }

                uparams = {
                    "flag": "profile", "id": that.empid, "wsautoid": that._enttdetails.wsautoid
                };

                that._empservice.getEmployeeDetails(uparams).subscribe(data => {
                    try {
                        that.employeeDT = data.data;
                    }
                    catch (e) {
                        that._msg.Show(messageType.error, "Error", e);
                    }

                    commonfun.loaderhide("#employee");
                }, err => {
                    that._msg.Show(messageType.error, "Error", err);
                    console.log(err);
                    commonfun.loaderhide("#employee");
                }, () => {

                })
            }
        });
    }

    public addEmployeeForm() {
        this._router.navigate(['/erp/' + this.psngrtype + '/add']);
    }

    public editEmployeeForm(row) {
        this._router.navigate(['/erp/' + this.psngrtype + '/edit', row.empid]);
    }
}
