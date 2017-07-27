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
    _wsdetails: any = [];
    _enttdetails: any = [];

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

    private subscribeParameters: any;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _autoservice: CommonService,
        private _bdsservice: BreakDownService, private _loginservice: LoginService, public _menuservice: MenuService,
        private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();
        this._enttdetails = Globals.getEntityDetails();

        // this.getBreakDown();

        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
        this.otherData.push({ "mobile": "", "email": "" });
    }

    ngOnInit() {

    }

    resetUserVehicleMap() {
        this.iscoordnot = false;
        this.iscoordmob = false;
        this.iscoordeml = false;
        this.isprntsnot = false;
        this.isprntsmob = false;
        this.isprntseml = false;
    }

    // Get Other Mobile No and Email ID

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

        var _mobiles: string[] = [];
        var _emails: string[] = [];

        // var _mobiles = that.getMobiles();
        // var _emails = that.getEmails();

        _mobiles = Object.keys(that.otherData).map(function (k) { return that.otherData[k].mobile !== "" ? that.otherData[k].mobile : "" });
        _emails = Object.keys(that.otherData).map(function (k) { return that.otherData[k].email !== "" ? that.otherData[k].email : "" });

        var saveBD = {
            "enttid": that._enttdetails.enttid,
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

    getBreakDown() {
        var that = this;

        that._bdsservice.getBreakDownSet({ "flag": "details", "enttid": that._enttdetails.enttid }).subscribe(data => {
            try {
                that.otherData = data.data;

                if (this.otherData.length == 0) {
                    this.otherData.push({ "mobile": "", "email": "" });
                    this.otherData.push({ "mobile": "", "email": "" });
                    this.otherData.push({ "mobile": "", "email": "" });
                    this.otherData.push({ "mobile": "", "email": "" });
                    this.otherData.push({ "mobile": "", "email": "" });
                }
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