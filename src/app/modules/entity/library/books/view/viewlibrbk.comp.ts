import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
    templateUrl: 'viewlibrbk.comp.html',
    providers: [CommonService]
})

export class ViewLibraryBooksComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    libraryDT: any = [];
    librid: number = 0;

    subjectDT: any = [];
    subid: number = 0;

    autoBooksDT: any = [];
    bookid: number = 0;
    bkname: string = "";

    libraryBooksDT: any = [];

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _librservice: LibraryService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
        this.getLibraryBooks();
    }

    public ngOnInit() {

    }

    // Fill Library, Subject Drop Down

    fillDropDownList() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBooks({
            "flag": "dropdown", "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.libraryDT = data.data.filter(a => a.group == "library");
                that.subjectDT = data.data.filter(a => a.group == "subject");
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

    // Auto Completed Person

    getPersonData(event, _persontype, _classid) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "autobooks", "uid": this.loginUser.uid, "utype": this.loginUser.utype,
            "bookid": this.bookid, "subid": this.subid, "librid": this.subid,
            "enttid": this._enttdetails.enttid, "wsautoid": this._enttdetails.wsautoid,
            "issysadmin": this.loginUser.issysadmin, "search": query
        }).subscribe((data) => {
            this.autoBooksDT = data.data;
        }, err => {
            this._msg.Show(messageType.error, "Error", err);
        }, () => {

        });
    }

    // Library Books

    getLibraryBooks() {
        var that = this;
        commonfun.loader();

        that._librservice.getLibraryBooks({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype,
            "bookid": that.bookid, "subid": that.subid, "librid": that.subid,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid,
            "issysadmin": that.loginUser.issysadmin
        }).subscribe(data => {
            try {
                that.libraryBooksDT = data.data;
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

    public addLibrarySubject() {
        this._router.navigate(['/master/librarybooks/add']);
    }

    public editLibrarySubject(row) {
        this._router.navigate(['/master/librarybooks/edit', row.bookid]);
    }
}
