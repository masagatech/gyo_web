import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';
import { StudentDashboardComponent } from './student/studsdb.comp';
import { DriverDashboardComponent } from './driver/drvdb.comp';
import { VehicleDashboardComponent } from './vehicle/vehdb.comp';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: './helpdesk.comp.html'
})

export class HelpDeskComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    flag: string = "";

    hdstud: string = "";
    hddrv: string = "";
    hdveh: string = "";

    hdtitle: string = "";

    private subscribeParameters: any;

    constructor(private _router: Router, private _actrouter: ActivatedRoute, private _loginservice: LoginService,
        private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);

        this.openHelpDeskDashboard();
    }

    loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }

    openDashboard(type) {
        if (type == "student") {
            if (Cookie.get("_studdata_") == null) {
                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: { "flag": "student" }
                });
            }
            else {
                var studdata = JSON.parse(Cookie.get("_studdata_"));

                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: studdata
                });
            }
        }
        else if (type == "driver") {
            if (Cookie.get("_drvdata_") == null) {
                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: { "flag": "driver" }
                });
            }
            else {
                var drvdata = JSON.parse(Cookie.get("_drvdata_"));

                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: drvdata
                });
            }
        }
        else if (type == "vehicle") {
            if (Cookie.get("_vehdata_") == null) {
                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: { "flag": "vehicle" }
                });
            }
            else {
                var vehdata = JSON.parse(Cookie.get("_vehdata_"));

                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: vehdata
                });
            }
        }
    }

    openHelpDeskDashboard() {
        var dparams = { loginUser: this.loginUser, _enttdetails: this._enttdetails };

        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";

            if (that.flag == "driver") {
                commonfun.loader("#loadercontrol", "pulse", "Loading Driver Dashboard...");

                that.hdstud = "";
                that.hddrv = "bg-green";
                that.hdveh = "";

                that.hdtitle = "Driver Dashboard";
                that.loadComponent(DriverDashboardComponent, dparams);

                commonfun.loaderhide("#loadercontrol", "pulse", "Loading Driver Dashboard...");
            }
            else if (that.flag == "vehicle") {
                commonfun.loader("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");

                that.hdstud = "";
                that.hddrv = "";
                that.hdveh = "bg-green";

                that.hdtitle = "Vehicle Dashboard";
                that.loadComponent(VehicleDashboardComponent, dparams);

                commonfun.loaderhide("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");
            }
            else {
                commonfun.loader("#loadercontrol", "pulse", "Loading Student Dashboard...");

                that.hdstud = "bg-green";
                that.hddrv = "";
                that.hdveh = "";

                that.hdtitle = "Student Dashboard";
                that.loadComponent(StudentDashboardComponent, dparams);

                commonfun.loaderhide("#loadercontrol", "pulse", "Loading Student Dashboard...");
            }
        });
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();

        this.subscribeParameters.unsubscribe();
    }
}