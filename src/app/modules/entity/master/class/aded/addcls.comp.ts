import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ClassService } from '@services/master';

declare var google: any;

@Component({
    templateUrl: 'addcls.comp.html'
})

export class AddClassComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    divno: number = 0;
    divData: any = [];
    divColumn: any = [];
    classDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _loginservice: LoginService,
        private _msg: MessageService, private _clsservice: ClassService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDivisionNoDropDown();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Fill Division No DropDown

    fillDivisionNoDropDown() {
        var that = this;
        var defdivDT: any = [];

        that._clsservice.getStandardDetails({
            "flag": "division", "divtype": "add", "divno": 0,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            that.divData = data.data;

            if (that.divData.length > 0) {
                defdivDT = that.divData.filter(a => a.isselected == true);

                if (defdivDT.length > 0) {
                    that.divno = defdivDT[0].id;
                }
                else {
                    that.divno = 5;
                }

                that.getDivisionData();
            }
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Get Division Data

    getDivisionData() {
        var that = this;

        that._clsservice.getStandardDetails({
            "flag": "division", "divtype": "add", "divno": that.divno,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            that.divColumn = data.data;
            that.getClassDetails();
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
        })
    }

    // Get Class

    getClassDetails() {
        var that = this;
        commonfun.loader();

        that._clsservice.getStandardDetails({
            "flag": "divmap", "divtype": "add", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "ctype": that.loginUser.ctype,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.classDT = data.data;
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

    // Save Class

    saveClassInfo() {
        var that = this;

        var _classstr = "";
        var _classdt = [];
        var _clsrow = null;
        var _divcol = null;

        var _clsid = 0;
        var _stdid = 0;
        var _divname = "";

        for (var i = 0; i < that.classDT.length; i++) {
            _clsrow = that.classDT[i];

            for (var j = 0; j < that.divColumn.length; j++) {
                _divcol = that.divColumn[j];

                _clsid = _clsrow[_divcol.divid];
                _stdid = _clsrow.stdid;
                _divname = _clsrow[_divcol.divcode];

                _classstr += '"clsid": "' + _clsid + '", "stdid":"' + _stdid + '", "divname":"' + _divname + '",';

                if (_divname != "") {
                    _classdt.push(JSON.parse("{" + _classstr.substring(0, _classstr.length - 1) + "}"));
                }
            }
        }

        commonfun.loader();

        var params = {
            "flag": "class",
            "classdetails": _classdt,
            "enttid": that._enttdetails.enttid,
            "wsautoid": that._enttdetails.wsautoid,
            "cuid": that.loginUser.ucode
        }

        that._clsservice.saveClassInfo(params).subscribe(data => {
            try {
                var dataResult = data.data[0].funsave_classinfo;
                var msg = dataResult.msg;
                var msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                    that.getDivisionData();
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/class']);
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
