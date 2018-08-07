import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
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

    hdpsngr: string = "";
    hddrv: string = "";
    hdveh: string = "";

    hdtitle: string = "";

    constructor(private _loginservice: LoginService, private _msg: MessageService, private componentFactoryResolver: ComponentFactoryResolver) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
        
        this.openHelpDeskDashboard("passenger");
    }

    loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }

    openHelpDeskDashboard(flag) {
        var params = { loginUser: this.loginUser, _enttdetails: this._enttdetails };

        if (flag == "passenger") {
            this.hdpsngr = "bg-green";
            this.hddrv = "";
            this.hdveh = "";

            this.hdtitle = this._enttdetails.psngrtype + " Dashboard";
            this.loadComponent(PassengerDashboardComponent, params);

            commonfun.loader("#loadercontrol", "pulse", "Loading " + this._enttdetails.psngrtype + " Dashboard...");
            event.stopPropagation();
            commonfun.loaderhide("#loadercontrol", "pulse", "Loading " + this._enttdetails.psngrtype + " Dashboard...");
        }
        else if (flag == "driver") {
            this.hdpsngr = "";
            this.hddrv = "bg-green";
            this.hdveh = "";

            this.hdtitle = "Driver Dashboard";
            this.loadComponent(DriverDashboardComponent, params);
            
            commonfun.loader("#loadercontrol", "pulse", "Loading Driver Dashboard...");
            event.stopPropagation();
            commonfun.loaderhide("#loadercontrol", "pulse", "Loading Driver Dashboard...");
        }
        else if (flag == "vehicle") {
            this.hdpsngr = "";
            this.hddrv = "";
            this.hdveh = "bg-green";

            this.hdtitle = "Vehicle Dashboard";
            this.loadComponent(VehicleDashboardComponent, params);
            
            commonfun.loader("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");
            event.stopPropagation();
            commonfun.loaderhide("#loadercontrol", "pulse", "Loading Vehicle Dashboard...");
        }
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}