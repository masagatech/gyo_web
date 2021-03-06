import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';
import jsPDF from 'jspdf';

@Component({
    templateUrl: 'rptentity.comp.html'
})

export class EntityReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    global = new Globals();

    entttypeDT: any = [];
    entttype: string = "";

    entityDT: any = [];

    @ViewChild('entity') entity: ElementRef;

    constructor(private _msg: MessageService, private _loginservice: LoginService, private _entityservice: EntityService,
        private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();

        this.fillDropDownList();

        if (sessionStorage.getItem("_entttype_") != null) {
            this.entttype = sessionStorage.getItem("_entttype_");
        }
        else {
            this.entttype = "";
        }

        this.getEntityDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            commonfun.navistyle();

            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 0);
    }

    // Entity Type DropDown

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._entityservice.getEntityDetails({ "flag": "dropdown" }).subscribe(data => {
            try {
                that.entttypeDT = data.data.filter(a => a.group === "wstype");
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

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.entityDT, "Entity Details");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');

        let options = {
            pagesplit: true
        };

        pdf.addHTML(this.entity.nativeElement, 0, 0, options, () => {
            pdf.save("EntityDetials.pdf");
        });
    }

    getEntityDetails() {
        var that = this;

        sessionStorage.setItem("_entttype_", this.entttype);
        that.entttype = sessionStorage.getItem("_entttype_");

        commonfun.loader();

        that._entityservice.getEntityDetails({
            "flag": "all", "type":"all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "entttype": that.entttype, "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.entityDT = data.data;
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

    resetEntityDetails() {
        sessionStorage.removeItem('_entttype_');
        this.entttype = "";
        this.getEntityDetails();
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
