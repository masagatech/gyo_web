import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService, EmployeeService } from '@services/master';

@Component({
    templateUrl: 'viewemp.comp.html'
})

export class ViewEmployeeComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    emptypeDT: any = [];
    emptype: string = "";
    status: string = "";

    classDT: any = [];
    classid: number = 0;

    psngrtype: string = "";
    psngrtypenm: string = "";

    employeeDT: any = [];

    selempid: number = 0;
    isShowList: boolean = true;
    isShowGrid: boolean = false;

    emptymsg: string = "";

    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _clsservice: ClassService, private _empservice: EmployeeService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getEmployeeDetails();
    }

    public ngOnInit() {

    }

    // Fill Department DropDown List

    fillDepartmentDropDown() {
        var that = this;
        that.emptypeDT = [];

        commonfun.loader();

        that._empservice.getEmployeeDetails({
            "flag": "dropdown", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                if (that.psngrtype == "teacher") {
                    that.emptypeDT = data.data.filter(a => a.group == "classtype");
                }
                else {
                    that.emptypeDT = data.data.filter(a => a.group == "emptype").filter(a => a.key != "tchr");
                }

                that.classDT = data.data.filter(a => a.group == "class");
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

        if (viewtype == "list") {
            that.isShowGrid = false;
            that.isShowList = true;
            commonfun.loaderhide("#divShow");
        }
        else {
            that.isShowGrid = true;
            that.isShowList = false;
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
                that.fillDepartmentDropDown();

                if (that.psngrtype == "teacher") {
                    that.psngrtypenm = 'Teacher';
                }
                else {
                    that.psngrtypenm = 'Employee';
                }

                params = {
                    "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
                    "emptype": that.psngrtype, "emptypid": that.emptype, "classid": that.classid, "status": that.status,
                    "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
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

    getClassTeacher(row) {
        var that = this;

        for (var i = 0; i < that.employeeDT.length; i++) {
            that.employeeDT[i].selempid = 0;
        }

        row.selempid = row.empid;
        that.selempid = row.selempid;
    }

    // Save Class Teacher

    saveClassTeacher() {
        var that = this;

        var params = {
            "flag": "classteacher", "clsid": that.classid, "clstchrid": that.selempid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }

        commonfun.loader();

        that._clsservice.saveClassInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_classinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getEmployeeDetails();
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }

                commonfun.loaderhide();
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {
            // console.log("Complete");
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
