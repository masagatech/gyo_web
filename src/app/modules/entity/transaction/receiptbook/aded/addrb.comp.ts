import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, messageType, LoginService } from '@services';
import { LoginUserModel, Globals } from '@models';
import { ReceiptBookService } from '@services/erp';

@Component({
    templateUrl: 'addrb.comp.html'
})

export class AddReceiptBookComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;
    _enttdetails: any = [];

    rbid: number = 0;
    rbcode: string = "";
    rbname: string = "";
    bankname: string = "";
    acno: string = "";
    ifsc: string = "";
    rbheader: string = "";
    rbfooter: string = "";
    remark: string = "";

    private subscribeParameters: any;

    constructor(private _rbservice: ReceiptBookService, private _routeParams: ActivatedRoute, private _router: Router,
        private _loginservice: LoginService, private _msg: MessageService) {
        this.loginUser = this._loginservice.getUser();
        this._enttdetails = Globals.getEntityDetails();
    }

    public ngOnInit() {
        var that = this;
        commonfun.loader();

        that.subscribeParameters = that._routeParams.params.subscribe(params => {
            if (params['id'] !== undefined) {
                that.rbid = params['id'];
                that.getReceiptBook();
            }
            else {
                that.resetReceiptBookFields();
                commonfun.loaderhide();
            }
        });
    }

    // Reset Receipt Book Details

    resetReceiptBookFields() {
        var that = this;

        that.rbid = 0;
        that.rbcode = "";
        that.rbname = "";
        that.bankname = "";
        that.acno = "";
        that.ifsc = "";
        that.rbheader = "";
        that.rbfooter = "";
        that.remark = "";
    }

    // Validation For Save Receipt Book

    isValidReceiptBook() {
        var that = this;

        if (that.rbcode == "") {
            that._msg.Show(messageType.info, "Info", "Enter Receipt Book Short Name");
            $(".rbcode").focus();
            return false;
        }

        if (that.rbname == "") {
            that._msg.Show(messageType.info, "Info", "Enter Receipt Book Name");
            $(".rbname").focus();
            return false;
        }

        if (that.bankname == "") {
            that._msg.Show(messageType.info, "Info", "Enter Bank Name");
            $(".bankname").focus();
            return false;
        }

        if (that.acno == "") {
            that._msg.Show(messageType.info, "Info", "Enter Account No");
            $(".acno").focus();
            return false;
        }

        if (that.ifsc == "") {
            that._msg.Show(messageType.info, "Info", "Enter IFSC");
            $(".ifsc").focus();
            return false;
        }

        return true;
    }

    // Save Receipt Book

    saveReceiptBook() {
        var that = this;
        var isvalid = false;

        isvalid = that.isValidReceiptBook();

        if (isvalid) {
            commonfun.loader();

            var params = {
                "rbid": that.rbid,
                "rbcode": that.rbcode,
                "rbname": that.rbname,
                "bankname": that.bankname,
                "acno": that.acno,
                "ifsc": that.ifsc,
                "rbheader": that.rbheader,
                "rbfooter": that.rbfooter,
                "remark": that.remark,
                "enttid": that._enttdetails.enttid,
                "wsautoid": that._enttdetails.wsautoid,
                "cuid": that.loginUser.ucode
            }

            that._rbservice.saveReceiptBook(params).subscribe(data => {
                try {
                    var dataResult = data.data[0].funsave_receiptbook;
                    var msg = dataResult.msg;
                    var msgid = dataResult.msgid;

                    if (msgid != "-1") {
                        that._msg.Show(messageType.success, "Success", msg);

                        if (msgid === "1") {
                            that.resetReceiptBookFields();
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

    // Get Receipt Book

    getReceiptBook() {
        var that = this;
        commonfun.loader();

        that._rbservice.getReceiptBook({ "flag": "edit", "id": that.rbid }).subscribe(data => {
            try {
                that.rbid = data.data[0].rbid;
                that.rbcode = data.data[0].rbcode;
                that.rbname = data.data[0].rbname;
                that.bankname = data.data[0].bankname;
                that.ifsc = data.data[0].ifsc;
                that.acno = data.data[0].acno;
                that.rbheader = data.data[0].rbheader;
                that.rbfooter = data.data[0].rbfooter;
                that.remark = data.data[0].remark;
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

    // Back For View Data

    backViewData() {
        this._router.navigate(['/transaction/receiptbook']);
    }

    ngOnDestroy() {
        this.subscribeParameters.unsubscribe();
    }
}
