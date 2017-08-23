import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { EntityService } from '@services/master';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptentity.comp.html',
    providers: [CommonService]
})

export class EntityReportsComponent implements OnInit, OnDestroy {
    entityDT: any = [];
    loginUser: LoginUserModel;

    _wsdetails: any = [];

    @ViewChild('entity') entity: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _entityservice: EntityService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();

        this._wsdetails = Globals.getWSDetails();
        this.viewEntityDataRights();
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

    public viewEntityDataRights() {
        var that = this;
        that.getEntityDetails();
    }

    getEntityDetails() {
        var that = this;

        commonfun.loader();

        that._entityservice.getEntityDetails({
            "flag": "all", "uid": that.loginUser.uid, "ucode": that.loginUser.ucode, "utype": that.loginUser.utype,
            "issysadmin": that.loginUser.issysadmin, "wsautoid": that._wsdetails.wsautoid
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

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
