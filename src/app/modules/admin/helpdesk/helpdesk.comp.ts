import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';
import { StudentDashboardComponent } from './student/studsdb.comp';
import { UserDashboardComponent } from './users/userdb.comp';
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
    hdusr: string = "";
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
        else {
            if (Cookie.get("_userdata_") == null) {
                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: { "flag": "" }
                });
            }
            else {
                var userdata = JSON.parse(Cookie.get("_userdata_"));

                this._router.navigate(['/admin/helpdesk'], {
                    queryParams: userdata
                });
            }
        }
    }

    openHelpDeskDashboard() {
        var dparams = { loginUser: this.loginUser, _enttdetails: this._enttdetails };

        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";

            commonfun.loader("#loadercontrol", "pulse", "loading " + that.flag + "...");

            that.hdtitle = that.flag;

            if (that.flag == "student") {
                that.hdstud = "bg-green";
                that.hdveh = "";
                that.hdusr = "";

                that.loadComponent(StudentDashboardComponent, dparams);
            }
            else if (that.flag == "vehicle") {
                that.hdstud = "";
                that.hdveh = "bg-green";
                that.hdusr = "";

                that.loadComponent(VehicleDashboardComponent, dparams);
            }
            else {
                that.hdstud = "";
                that.hdveh = "";
                that.hdusr = "bg-green";

                that.loadComponent(UserDashboardComponent, dparams);
            }

            commonfun.loaderhide("#loadercontrol", "pulse", "loading " + that.flag + "...");
        });
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();

        this.subscribeParameters.unsubscribe();
    }
}