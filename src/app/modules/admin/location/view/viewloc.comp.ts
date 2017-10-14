import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LocationService } from '@services/master';
import { LoginUserModel } from '@models';
import { LazyLoadEvent } from 'primeng/primeng';

@Component({
    templateUrl: 'viewloc.comp.html'
})

export class ViewLocationComponent implements OnInit {
    locationDT: any = [];
    loginUser: LoginUserModel;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _locservice: LocationService) {
        this.loginUser = this._loginservice.getUser();
        this.viewLocationDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();
        }, 0);
    }

    public viewLocationDataRights() {
        let that = this;
        
    }

    getLocationDetails() {
        let that = this;
        commonfun.loader();

        that._locservice.getLocationDetails({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype
        }).subscribe(data => {
            try {
                that.locationDT = data.data;
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

    public addLocationForm() {
        this._router.navigate(['/workspace/location/add']);
    }

    public editLocationForm(row) {
        this._router.navigate(['/workspace/location/edit', row.locid]);
    }
}
