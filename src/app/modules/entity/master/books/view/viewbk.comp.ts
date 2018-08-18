import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { BookService } from '@services/master';

@Component({
    templateUrl: 'viewbk.comp.html',
    providers: [CommonService]
})

export class ViewBooksComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];
    
    booksDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _bkservice: BookService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getSubject();
    }

    public ngOnInit() {

    }

    // Subject

    getSubject() {
        var that = this;
        commonfun.loader();

        that._bkservice.getBooksDetails({
            "flag": "all", "wsautoid": that._enttdetails.wsautoid, "enttid": that._enttdetails.enttid
        }).subscribe(data => {
            try {
                that.booksDT = data.data;
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

    public addSubject() {
        this._router.navigate(['/master/classbooks/add']);
    }

    public editSubject(row) {
        this._router.navigate(['/master/classbooks/edit', row.bkid]);
    }
}
