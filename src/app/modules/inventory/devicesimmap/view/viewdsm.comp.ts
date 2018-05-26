import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { InventoryService } from '@services/master';

@Component({
    templateUrl: 'viewdsm.comp.html'
})

export class ViewDeviceSimMapComponent implements OnInit {
    loginUser: LoginUserModel;
    _wsdetails: any = [];

    devsimDT: any = [];

    constructor(private _invservice: InventoryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _msg: MessageService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
        this._wsdetails = Globals.getWSDetails();

        this.getDeivceSimMap();
    }

    public ngOnInit() {

    }

    // Get Deivce Sim Map

    getDeivceSimMap() {
        var that = this;
        commonfun.loader();

        that._invservice.getDeiviceSimMapping({ "flag": "all", "wsautoid": that._wsdetails.wsautoid }).subscribe(data => {
            try {
                that.devsimDT = data.data;
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

    public addDeviceSimMap() {
        this._router.navigate(['/inventory/devicesimmap/add']);
    }

    public editDeviceSimMap(row) {
        this._router.navigate(['/inventory/devicesimmap/edit', row.dsmapid]);
    }
}
