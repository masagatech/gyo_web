import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReceiptBookService } from '@services/erp';

@Component({
    templateUrl: 'viewrb.comp.html'
})

export class ViewReceiptBookComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    receiptBookDT: any = [];

    constructor(private _router: Router, private _loginservice: LoginService, private _msg: MessageService,
        private _rbservice: ReceiptBookService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();

        this.getReceiptBook();
    }

    public ngOnInit() {

    }

    // Get Receipt Book

    getReceiptBook() {
        var that = this;
        commonfun.loader();

        that._rbservice.getReceiptBook({
            "flag": "all", "uid": that.loginUser.uid, "utype": that.loginUser.utype, "issysadmin": that.loginUser.issysadmin,
            "enttid": that._enttdetails.enttid, "wsautoid": that._enttdetails.wsautoid
        }).subscribe(data => {
            try {
                that.receiptBookDT = data.data;
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

    // Add Receipt Book

    addReceiptBook() {
        this._router.navigate(['/transaction/receiptbook/add']);
    }

    // Active / Deactive Receipt Book

    private active_deactive_ReceiptBook(row) {
        let that = this;

        that._rbservice.saveReceiptBook({
            "mode": "active/deactive", "rbid": row.rbid, "isactive": row.isactive
        }).subscribe(data => {
            try {
                let dataResult = data.data[0].funsave_receiptbook;
                let msg = dataResult.msg;
                let msgid = dataResult.msgid;

                if (msgid != "-1") {
                    that._msg.Show(messageType.success, "Success", msg);
                }
                else {
                    that._msg.Show(messageType.error, "Error", msg);
                }
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            console.log(err);
        }, () => {
            // console.log("Complete");
        });
    }

    // Edit Receipt Book

    editReceiptBook(row) {
        if (row.isactive) {
            this._router.navigate(['/transaction/receiptbook/edit', row.rbid]);
        }
        else {
            this._msg.Show(messageType.error, "Error", "This Receipt Book is Inactive");
        }
    }

    public ngOnDestroy() {

    }
}
