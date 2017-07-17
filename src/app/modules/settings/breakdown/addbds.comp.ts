import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, MenuService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { BreakDownService } from '@services/master';

@Component({
    templateUrl: 'addbds.comp.html',
    providers: [MenuService, CommonService]
})

export class AddBreakDownComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    entityDT: any = [];
    enttid: number = 0;
    enttname: string = "";

    iscoordnot: boolean = false;
    iscoordmob: boolean = false;
    iscoordeml: boolean = false;

    isprntsnot: boolean = false;
    isprntsmob: boolean = false;
    isprntseml: boolean = false;

    otherData: any = [];

    message: string = "";

    coordSMSData: any = [];
    coordEmailData: any = [];

    _wsdetails: any = [];
    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService,
        private _bdsservice: BreakDownService, private _loginservice: LoginService, public _menuservice: MenuService,
        private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getOtherData();
    }

    ngOnInit() {
        setTimeout(function () {
            $(".uname input").focus();
        }, 100);
    }

    // Auto Completed Entity

    getEntityData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "entity",
            "uid": this.loginUser.uid,
            "ucode": this.loginUser.ucode,
            "utype": this.loginUser.utype,
            "issysadmin": this.loginUser.issysadmin,
            "wsautoid": this._wsdetails.wsautoid,
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
    }

    resetUserVehicleMap() {
        $(".enttname").focus();
        this.enttid = 0;
        this.enttname = "";
        this.iscoordnot = false;
        this.iscoordmob = false;
        this.iscoordeml = false;
        this.isprntsnot = false;
        this.isprntsmob = false;
        this.isprntseml = false;
    }

    // Get Other Mobile No and Email ID

    getOtherData() {
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
    }

    getMobiles() {
        var that = this;

        var _mobile = that.otherData.map(function (val) {
            return val.mobile !== "" ? val.mobile : "";
        }).join(',');

        return _mobile;
    }

    getEmails() {
        var that = this;

        var _email = that.otherData.map(function (val) {
            return val.email !== "" ? val.email : "";
        }).join(',');

        return _email;
    }

    saveBreakDown() {
        var that = this;

        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Entity");
            $(".enttname input").focus();
        }
        else {
            var _mobiles: string[] = [];
            var _emails: string[] = [];

            // var _mobiles = that.getMobiles();
            // var _emails = that.getEmails();

            _mobiles = Object.keys(that.otherData).map(function (k) { return that.otherData[k].mobile !== "" ? that.otherData[k].mobile : "" });
            _emails = Object.keys(that.otherData).map(function (k) { return that.otherData[k].email !== "" ? that.otherData[k].email : "" });

            var saveBD = {
                "enttid": that.enttid,
                "iscoordnot": that.iscoordnot,
                "iscoordmob": that.iscoordmob,
                "iscoordeml": that.iscoordeml,
                "isprntsnot": that.isprntsnot,
                "isprntsmob": that.isprntsmob,
                "isprntseml": that.isprntseml,
                "mobiles": _mobiles,
                "emails": _emails,
                "message": that.message,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._bdsservice.saveBreakDownSet(saveBD).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_breakdownset;

                    if (dataResult.msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", dataResult.msg);
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", dataResult.msg);
                    }

                    that.resetUserVehicleMap();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
            }, () => {
            });
        }
    }

    getBreakDown() {
        var that = this;

        that._bdsservice.getBreakDownSet({ "flag": "details", "enttid": that.enttid }).subscribe(data => {
            try {
                that.otherData = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Commented

    getCoordSMS() {
        var that = this;

        that._bdsservice.getBreakDownSet({ "flag": "coordsms" }).subscribe(data => {
            try {
                that.coordSMSData = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    getCoordEmail() {
        var that = this;

        that._bdsservice.getBreakDownSet({ "flag": "coordemail" }).subscribe(data => {
            try {
                that.coordEmailData = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    ngOnDestroy() {
    }
}