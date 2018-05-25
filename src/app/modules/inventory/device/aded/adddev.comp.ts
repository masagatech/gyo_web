import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { InventoryService } from '@services/master';

@Component({
    templateUrl: 'adddev.comp.html'
})

export class AddDeviceComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    global = new Globals();

    // Device Variable

    devtypeDT: any = [];

    devparamid: number = 0;
    devid: number = 0;
    devtype: string = "";
    devimeino: string = "";
    devcmpname: string = "";
    devpurdate: any = "";

    private subscribeParameters: any;

    constructor(private _invservice: InventoryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getDeviceDetails();
    }

    // Device Master

    // Fill Device Type Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._invservice.getDeviceDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.devtypeDT = data.data.filter(a => a.group == "devtyp");
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }

            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    // Clear Device Fields

    resetDeviceInfo() {
        this.devid = 0;
        this.devtype = "";
        this.devimeino = "";
        this.devcmpname = "";
        this.devpurdate = "";
    }

    // Save Device Data

    saveDeviceInfo() {
        var that = this;

        if (that.devtype == "") {
            that._msg.Show(messageType.error, "Error", "Select Device Type");
            $(".devtype").focus();
        }
        else if (that.devimeino == "") {
            that._msg.Show(messageType.error, "Error", "Enter IMEI No");
            $(".devimeino").focus();
        }
        else if (that.devcmpname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Company Name");
            $(".devcmpname").focus();
        }
        else if (that.devpurdate == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Purchase Date");
            $(".devpurdate").focus();
        }
        else {
            commonfun.loader();

            var params = {
                "devid": that.devid,
                "devtype": that.devtype,
                "imeino": that.devimeino,
                "cmpname": that.devcmpname,
                "purdate": that.devpurdate,
                "cuid": that.loginUser.ucode,
                "wsautoid": that._wsdetails.wsautoid
            }

            that._invservice.saveDeviceInfo(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_deviceinfo;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid == "1") {
                            that.getDeviceDetails();
                            that.resetDeviceInfo();
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
            });
        }
    }

    // Get Device Data

    getDeviceDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.devparamid = params['id'];

                that._invservice.getDeviceDetails({
                    "flag": "edit", "id": that.devparamid, "wsautoid": that._wsdetails.wsautoid
                }).subscribe(data => {
                    try {
                        that.devid = data.data[0].devid;
                        that.devtype = data.data[0].devtype;
                        that.devimeino = data.data[0].imeino;
                        that.devcmpname = data.data[0].cmpname;
                        that.devpurdate = data.data[0].purdate;
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
                that.resetDeviceInfo();
                commonfun.loaderhide();
            }
        });
    }

    public backViewData() {
        this._router.navigate(['/inventory/device']);
    }
}
