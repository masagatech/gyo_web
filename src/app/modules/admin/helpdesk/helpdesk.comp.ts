import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';
import { PassengerDashboardComponent } from './passenger/psngrdb.comp';
import { DriverDashboardComponent } from './driver/drvdb.comp';
import { VehicleDashboardComponent } from './vehicle/vehdb.comp';

@Component({
    templateUrl: './helpdesk.comp.html'
})

export class HelpDeskComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    flag: string = "";

    hdpsngr: string = "";
    hddrv: string = "";
    hdveh: string = "";

    hdtitle: string = "";

    private subscribeParameters: any;

    constructor(private _actrouter: ActivatedRoute, private _loginservice: LoginService, private _msg: MessageService,
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

    openHelpDeskDashboard() {
        var dparams = { loginUser: this.loginUser, _enttdetails: this._enttdetails };

        var that = this;

        that.subscribeParameters = that._actrouter.queryParams.subscribe(params => {
            that.flag = params['flag'] || "";

            if (that.flag == "driver") {
                commonfun.loader("#loadercontrol", "pulse", "Loading Driver Dashboard...");

                that.hdpsngr = "";
                that.hddrv = "bg-green";
                that.hdveh = "";

                that.hdtitle = "Driver Dashboard";
                that.loadComponent(DriverDashboardComponent, dparams);

                commonfun.loaderhide("#loadercontrol", "pulse", "Loading Driver Dashboard...");
            }
            else if (that.flag == "vehicle") {
                commonfun.loader("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");

                that.hdpsngr = "";
                that.hddrv = "";
                that.hdveh = "bg-green";

                that.hdtitle = "Vehicle Dashboard";
                that.loadComponent(VehicleDashboardComponent, dparams);

                commonfun.loaderhide("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");
            }
            else {
                commonfun.loader("#loadercontrol", "pulse", "Loading Student Dashboard...");

                that.hdpsngr = "bg-green";
                that.hddrv = "";
                that.hdveh = "";

                that.hdtitle = "Student Dashboard";
                that.loadComponent(PassengerDashboardComponent, dparams);

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