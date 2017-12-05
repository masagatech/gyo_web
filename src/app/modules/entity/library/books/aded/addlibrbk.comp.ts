import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService, CommonService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { LibraryService } from '@services/master';
import { Cookie } from 'ng2-cookies/ng2-cookies';

declare var google: any;

@Component({
    templateUrl: 'addlibrbk.comp.html',
    providers: [CommonService]
})

export class AddLibraryBooksComponent implements OnInit {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    libraryDT: any = [];
    librid: number = 0;

    subjectDT: any = [];
    subid: number = 0;

    bookid: number = 0;
    bkname: string = "";
    bkdesc: string = "";
    fromno: number = 0;
    tono: number = 0;
    noofbook: number = 0;
    lmtissd: number = 0;
    aftrlmtfine: any = "";
    athrname: string = "";
    publication: string = "";

    private subscribeParameters: any;

    constructor(private _librservice: LibraryService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService, private _autoservice: CommonService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.fillDropDownList();
    }

    public ngOnInit() {
        this.getBooksDetails();

        setTimeout(function () {
            $(".librid").focus();
        }, 200);
    }

    // Clear Fields

    resetBooksFields() {
        var that = this;

        that.bookid = 0;
        that.bkname = "";
        that.bkdesc = "";
        that.librid = 0;
        that.subid = 0;
        that.fromno = 0;
        that.tono = 0;
        that.noofbook = 0;
        that.lmtissd = 0;
        that.aftrlmtfine = "";
        that.athrname = "";
        that.publication = "";
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

    // Save Books

    saveBooksInfo() {
        var that = this;

        if (that.librid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Library");
            $(".librid").focus();
        }
        else if (that.subid == 0) {
            that._msg.Show(messageType.error, "Error", "Select Subject");
            $(".subid").focus();
        }
        else if (that.bkname == "") {
            that._msg.Show(messageType.error, "Error", "Enter Book Name");
            $(".bkname").focus();
        }
        else if (that.noofbook == 0) {
            that._msg.Show(messageType.error, "Error", "Enter No of Book");
            $(".noofbook").focus();
        }
        else if (that.fromno == 0) {
            that._msg.Show(messageType.error, "Error", "Enter From No");
            $(".fromno").focus();
        }
        else if (that.tono == 0) {
            that._msg.Show(messageType.error, "Error", "Enter To No");
            $(".tono").focus();
        }
        else if (that.lmtissd == 0) {
            that._msg.Show(messageType.error, "Error", "Enter Limit Issued");
            $(".lmtissd").focus();
        }
        else if (that.aftrlmtfine == 0) {
            that._msg.Show(messageType.error, "Error", "Enter After Limit Issued Per Day Fine");
            $(".aftrlmtfine").focus();
        }
        else {
            commonfun.loader();

            var saventf = {
                "bookid": that.bookid,
                "librid": that.librid,
                "subid": that.subid,
                "bkname": that.bkname,
                "bkdesc": that.bkdesc,
                "noofbook": that.noofbook,
                "fromno": that.fromno,
                "tono": that.tono,
                "lmtissd": that.lmtissd,
                "aftrlmtfine": that.aftrlmtfine,
                "athrname": that.athrname,
                "publication": that.publication,
                "cuid": that.loginUser.ucode,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid
            }

            this._librservice.saveLibraryBooks(saventf).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_librarybooks;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetBooksFields();
                        }
                        else {
                            that.backViewData();
                        }
                    }
                    else {
                        that._msg.Show(messageType.error, "Error", msg);
                    }

                    commonfun.loaderhide();
                }
                catch (e) {
                    that._msg.Show(messageType.error, "Error", e);
                }
            }, err => {
                that._msg.Show(messageType.error, "Error", err);
                console.log(err);
                commonfun.loaderhide();
            }, () => {
                // console.log("Complete");
            });
        }
    }

    // Get Books

    getBooksDetails() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.bookid = params['id'];

                that._librservice.getLibraryBooks({ "flag": "edit", "bookid": that.bookid, "wsautoid": that._enttdetails.wsautoid }).subscribe(data => {
                    try {
                        var viewntf = data.data;

                        that.bookid = viewntf[0].bookid;
                        that.bkname = viewntf[0].bkname;
                        that.bkdesc = viewntf[0].bkdesc;
                        that.librid = data.data[0].librid;
                        that.subid = data.data[0].subid;
                        that.fromno = data.data[0].fromno;
                        that.tono = data.data[0].tono;
                        that.noofbook = data.data[0].noofbook;
                        that.lmtissd = data.data[0].lmtissd;
                        that.aftrlmtfine = data.data[0].aftrlmtfine;
                        that.athrname = data.data[0].athrname;
                        that.publication = data.data[0].publication;
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
            else {
                that.resetBooksFields();
                commonfun.loaderhide();
            }
        });
    }

    // Back For View Data

    backViewData() {
        this._router.navigate(['/master/librarybooks']);
    }
}
