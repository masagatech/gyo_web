import { Component, OnInit } from '@angular/core';
import { DriverService } from '../../../_services/driver/driver-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: 'viewdriver.comp.html',
    providers: [DriverService]
})

export class ViewDriverComponent implements OnInit {
    driverDT: any = [];

    constructor(private _driverservice: DriverService, private _routeParams: ActivatedRoute, private _router: Router) {
        this.getDriverDetails();
    }

    public ngOnInit() {
        setTimeout(function() {
            commonfun.navistyle();
        }, 0);
    }

    getDriverDetails() {
        var that = this;
        commonfun.loader();

        that._driverservice.getDriverDetails({ "flag": "all" }).subscribe(data => {
            that.driverDT = data.data;
            commonfun.loaderhide();
        }, err => {
            //that._msg.Show(messageType.error, "Error", err);
            console.log(err);
            commonfun.loaderhide();
        }, () => {

        })
    }

    public addDriverForm() {
        this._router.navigate(['/driver/add']);
    }

    public editDriverForm(row) {
        this._router.navigate(['/driver/edit', row.autoid]);
    }
}
