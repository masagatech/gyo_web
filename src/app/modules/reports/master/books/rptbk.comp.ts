import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { BookService } from '@services/master';
import { LazyLoadEvent } from 'primeng/primeng';
import jsPDF from 'jspdf'

@Component({
    templateUrl: 'rptbk.comp.html',
    providers: [CommonService]
})

export class BooksReportsComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    booksDT: any = [];

    @ViewChild('books') books: ElementRef;

    constructor(private _routeParams: ActivatedRoute, private _router: Router, private _msg: MessageService,
        private _loginservice: LoginService, private _autoservice: CommonService, private _bkservice: BookService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getBooksDetails();
    }

    public ngOnInit() {
        setTimeout(function () {
            $.AdminBSB.islocked = true;
            $.AdminBSB.leftSideBar.Close();
            $.AdminBSB.rightSideBar.activate();
        }, 100);
    }

    // Books

    getBooksDetails() {
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

    // Export

    public exportToCSV() {
        this._autoservice.exportToCSV(this.booksDT, "Books Reports");
    }

    public exportToPDF() {
        let pdf = new jsPDF('l', 'pt', 'a4');
        let options = {
            pagesplit: true
        };
        pdf.addHTML(this.books.nativeElement, 0, 0, options, () => {
            pdf.save("Books Reports.pdf");
        });
    }

    public ngOnDestroy() {
        $.AdminBSB.islocked = false;
        $.AdminBSB.leftSideBar.Open();
    }
}
