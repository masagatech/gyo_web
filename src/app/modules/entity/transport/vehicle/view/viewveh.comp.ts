import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { VehicleService } from '@services/master';

@Component({
    templateUrl: 'viewveh.comp.html'
})

export class ViewVehicleComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    vehicleDT: any = [];
    srcvehname: string = "";

    constructor(private _router: Router, private _msg: MessageService, private _loginservice: LoginService, private _vehservice: VehicleService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getVehicleDetails();
    }

    public ngOnInit() {

    }

    getVehicleDetails() {
        var that = this;

        commonfun.loader();

        that._vehservice.getVehicleDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.vehicleDT = data.data;
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

    public addVehicleForm() {
        this._router.navigate(['/transport/vehicle/add']);
    }

    public editVehicleForm(row) {
        this._router.navigate(['/transport/vehicle/edit', row.autoid]);
    }
}
