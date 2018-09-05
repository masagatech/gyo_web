import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { DriverService } from '@services/master';

@Component({
    templateUrl: 'viewdriver.comp.html'
})

export class ViewDriverComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    global = new Globals();

    driverDT: any = [];
    srcdrvname: string = "";

    isShowGrid: boolean = true;
    isShowList: boolean = false;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _driverservice: DriverService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getDriverDetails();
    }

    public ngOnInit() {
        var that = this;
        that.refreshButtons();

        setTimeout(function () {
            commonfun.navistyle();
            $(".enttname input").focus();
        }, 100);
    }

    isshDriver(viewtype) {
        var that = this;

        if (viewtype == "grid") {
            that.isShowGrid = true;
            that.isShowList = false;
        }
        else {
            that.isShowGrid = false;
            that.isShowList = true;
        }

        that.refreshButtons();
    }

    refreshButtons() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    getDriverDetails() {
        var that = this;

        commonfun.loader();

        that._driverservice.getDriverDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "enttid": that._enttdetails.enttid, "issysadmin": that.loginUser.issysadmin, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.driverDT = data.data;
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

    public addDriverForm() {
        this._router.navigate(['/transport/driver/add']);
    }

    public editDriverForm(row) {
        this._router.navigate(['/transport/driver/edit', row.autoid]);
    }

    public deleteDriver(row) {
        var that = this;

        that._autoservice.confirmmsgbox("Your record has been deleted", "Are you sure, you want to delete ?", "Your record is safe", function (e) {
            var params = {
                "autoid": row.autoid,
                "mode": "delete"
            }
    
            that._driverservice.saveDriverInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data;
                    that.getDriverDetails();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                console.log(err);
            }, () => {
                // console.log("Complete");
            });
        });
    }
}
