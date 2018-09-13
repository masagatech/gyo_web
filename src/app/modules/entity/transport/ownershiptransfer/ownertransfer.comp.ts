import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';

@Component({
    templateUrl: 'ownertransfer.comp.html'
})

export class OwnerShipTranferComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    mdltype: string = "";

    moduleDT: any = [];
    mdlid: number = 0;

    entityDT: any = [];
    enttid: number = 0;

    moduleData: any = [];
    oldModuleData: any = [];
    newModuleData: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {

    }

    // Get Module DropDown

    getModuleData() {
        var that = this;

        that._autoservice.getDropDownData({
            "flag": that.mdltype,
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            that.moduleDT = data.data;
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Get Entity DropDown

    getEntityData() {
        var that = this;

        that._autoservice.getDropDownData({
            "flag": that.mdltype,
            "id": that.mdlid,
            "uid": that.loginUser.uid,
            "ucode": that.loginUser.ucode,
            "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            that.entityDT = data.data[0].schooldt;
            that.enttid = data.data[0].enttid;

            that.moduleData = that.getModuleParams();
            that.oldModuleData = that.getAuditParams();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Get Audit Parameter

    getAuditParams() {
        var that = this;
        var _auditdt = [];

        if (that.mdltype == "driver") {
            _auditdt = [
                { "key": "Driver Name", "val": $("#mdlid option:selected").text().trim(), "fldname": "drivername", "fldtype": "text" },
                { "key": "Entity Name", "val": $("#enttid option:selected").text().trim(), "fldname": "enttid", "fldtype": "ddl" }
            ]
        }
        else {
            _auditdt = [
                { "key": "Vehicle Name", "val": $("#mdlid option:selected").text().trim(), "fldname": "vehregno", "fldtype": "text" },
                { "key": "Entity Name", "val": $("#enttid option:selected").text().trim(), "fldname": "enttid", "fldtype": "ddl" }
            ]
        }

        return _auditdt;
    }

    // Audit Log

    saveAuditLog(id, name, oldval, newval) {
        var that = this;

        var _oldvaldt = [];
        var _newvaldt = [];
        var _dispflds = [];

        for (var i = 0; i < Object.keys(oldval).length; i++) {
            _oldvaldt.push(that.oldModuleData.filter(a => a.fldname == Object.keys(oldval)[i]));
        }

        for (var i = 0; i < Object.keys(newval).length; i++) {
            _newvaldt.push(that.newModuleData.filter(a => a.fldname == Object.keys(newval)[i]));
        }

        var _oldval = that._autoservice.replaceJSON(_oldvaldt);
        var _newval = that._autoservice.replaceJSON(_newvaldt);

        if (_newval != "") {
            if (that.mdltype == "driver") {
                _dispflds = [{ "key": "Driver Name", "val": name }];
            }
            else {
                _dispflds = [{ "key": "Vehicle Name", "val": name }];
            }

            var auditparams = {
                "loginsessionid": that.loginUser.sessiondetails.sessionid, "mdlcode": that.mdltype, "mdlname": $("#mdltype option:selected").text().trim(),
                "id": id, "dispflds": _dispflds, "oldval": _oldval, "newval": _newval, "ayid": that._enttdetails.ayid,
                "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "createdby": that.loginUser.ucode
            };

            that._autoservice.saveAuditLog(auditparams);
        }
    }

    // Get Save Parameter

    getModuleParams() {
        var that = this;

        var params = {
            "flag": that.mdltype,
            "enttid": that.enttid,
            "autoid": that.mdlid,
            "cuid": that.loginUser.ucode
        }

        return params;
    }

    // Validation Third Party Integration

    isValidateOwnershipTransfer(newval) {
        var that = this;

        if (that.mdltype == "") {
            that._msg.Show(messageType.error, "Error", "Select Module Type");
            return false;
        }
        if (that.mdlid == 0) {
            that._msg.Show(messageType.error, "Error", "Select " + $("#mdltype option:selected").text().trim());
            return false;
        }
        if (that.enttid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Entity Name");
            return false;
        }
        if (JSON.stringify(newval) == "{}") {
            that._msg.Show(messageType.warn, "Warning", "No any Changes");
            return false;
        }

        return true;
    }

    // Save Third Party Integration

    saveOwnershipTransfer() {
        var that = this;

        var params = that.getModuleParams();
        that.newModuleData = that.getAuditParams();

        var newval = that._autoservice.getDiff2Arrays(that.moduleData, params);
        var oldval = that._autoservice.getDiff2Arrays(params, that.moduleData);

        var isvalid = that.isValidateOwnershipTransfer(newval);

        if (isvalid) {
            commonfun.loader();

            that._autoservice.saveOwnershipTransfer(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_ownershiptransfer;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;
                    var autoid = dataResult.autoid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);
                        that.saveAuditLog(autoid, $("#mdlid option:selected").text().trim(), oldval, newval);
                        that.resetOwnershipTransfer();
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
            });
        }
    }

    resetOwnershipTransfer() {
        var that = this;

        that.mdltype = "";
        that.mdlid = 0;
        that.enttid = 0;
    }

    ngOnDestroy() {

    }
}
