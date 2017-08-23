import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LocationService } from '@services/master';
import { LoginUserModel } from '@models';
import { LazyLoadEvent } from 'primeng/primeng';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptloc.comp.html',
    providers: [CommonService]
})

export class LocationReportsComponent implements OnInit, OnDestroy {
    locationDT: any = [];
    loginUser: LoginUserModel;

    @ViewChild('location') location: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _locservice: LocationService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this.viewLocationDataRights();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.locationDT, "Location Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.location.nativeElement, 0, 0, options, () => {
            pdf.save("LocationReports.pdf");
        });
    }

    public viewLocationDataRights() {
        let that = this;
        that.getLocationDetails();
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
