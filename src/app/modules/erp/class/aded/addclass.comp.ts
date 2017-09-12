import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/erp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addclass.comp.html',
    providers: [CommonService]
})

export class AddClassComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    clsid: number = 0;
    stdid: number = 0;
    divid: number = 0;

    teacherDT: any = [];
    tchrdata: any = [];
    tchrid: number = 0;
    tchrname: string = "";

    standardDT: string = "";
    divisionDT: any = [];

    uploadClassDT: any = [];
    global = new Globals();
    uploadconfig = { server: "", serverpath: "", uploadurl: "", filepath: "", method: "post", maxFilesize: "", acceptedFiles: "" };
    chooseLabel: string = "";

    private subscribeParameters: any;

    constructor(private _clsservice: ClassService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getClassDetails();
    }

    // Fill Subject And Standard Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._clsservice.getClassDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.standardDT = data.data.filter(a => a.group == "standard");
                that.divisionDT = data.data.filter(a => a.group == "division");
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

    // Auto Completed Teacher

    getTeacherData(event) {
        let query = event.query;

        this._autoservice.getERPAutoData({
            "flag": "employee",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "emptype": "tchr",
            "enttid": this._enttdetails.enttid,
            "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin,
            "search": query
        }).subscribe((data) => {
            this.teacherDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Selected Teacher

    selectTeacherData(event) {
        this.tchrid = event.value;
        this.tchrname = event.label;
    }

    // Clear Fields

    resetClassFields() {
        var that = this;

        that.stdid = 0;
        that.divid = 0;
        that.tchrid = 0;
        that.tchrname = "";
        that.tchrdata = [];
    }

    // Save Class

    saveClassInfo() {
        var that = this;

        if (that.stdid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Standard");
            $(".standard").focus();
        }
        else if (that.divid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subject").focus();
        }
        else if (that.tchrid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Class Teacher");
            $(".tchrname input").focus();
        }
        else {
            commonfun.loader();

            var saveClass = {
                "clsid": that.clsid,
                "stdid": that.stdid,
                "divid": that.divid,
                "tchrid": that.tchrid,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._clsservice.saveClassInfo(saveClass).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_classinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetClassFields();
                        }
                        else {
                            that.backViewData();
                        }
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
    }

    // Get Class

    getClassDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.clsid = params['id'];

                that._clsservice.getClassDetails({
                    "flag": "edit", "clsid": that.clsid, "wsautoid": that._enttdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.clsid = data.data[0].clsid;
                        that.stdid = data.data[0].stdid;
                        that.divid = data.data[0].divid;

                        that.tchrid = data.data[0].tchrid;
                        that.tchrname = data.data[0].tchrname;
                        that.tchrdata.value = that.tchrid;
                        that.tchrdata.label = that.tchrname;
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
                that.resetClassFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/erp/class']);
    }
}
