import { Component, OnInit, OnDestroy, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ADHOST } from '@directives';
import { HOSTComponent } from '@interface';
import { StudentDashboardComponent } from './student/studsdb.comp';

@Component({
    templateUrl: './helpdesk.comp.html'
})

export class HelpDeskComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    @ViewChild(ADHOST)
    private _Host: ADHOST;

    hdtypeDT: any = [];
    hdtype: string = "";

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
    }

    loadComponent(component, data) {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
        let viewContainerRef = this._Host.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (<HOSTComponent>componentRef.instance).data = data;
    }

    openStudentDashboard() {
        this.hdtitle = "Student Dashboard";
        this.loadComponent(StudentDashboardComponent, { loginUser: this.loginUser, _enttdetails: this._enttdetails });
        commonfun.loader("#loadercontrol", "pulse", "Loading Student Dashboard...");

        event.stopPropagation();

        commonfun.loaderhide("#loadercontrol", "pulse", "Loading Student Dashboard...");
    }

    ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}