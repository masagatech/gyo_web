import { Cookie } from 'ng2-cookies/ng2-cookies';

export class Globals {
    static erproute: string = "erp/"
    photoid: 29;

    // serviceurl: string = "http://localhost:8082/goyoapi/";
<<<<<<< HEAD
    // trackurl: string = "http://localhost:6979/goyoapi/";

    // uploadurl: string = "http://localhost:8082/images/";
    // filepath: string = "www\\uploads\\";
    // static socketurl: string = "http://localhost:6979/";

    serviceurl: string = "http://track.goyo.in:8082/goyoapi/";
    uploadurl: string = "http://track.goyo.in:8082/images/";
    filepath: string = "www/uploads/";
    static socketurl: string = "http://track.goyo.in:8082/";
    // trackurl: string = "http://35.154.114.229:6979/goyoapi/";

    static socketurl_trk: string = "http://35.154.114.229:6979/";
    trackurl_trk: string = "http://35.154.114.229:6979/goyoapi/";


    // serviceurl: string = "http://school.goyo.in:8082/goyoapi/";
    // uploadurl: string = "http://school.goyo.in:8082/images/";
    // filepath: string = "www/uploads/";
    // static socketurl: string = "http://school.goyo.in:8082/";
=======
    // uploadurl: string = "http://localhost:8082/images/";
    // filepath: string = "www\\uploads\\";
    // static socketurl: string = "http://localhost:8082/";

    serviceurl: string = "http://school.goyo.in:8082/goyoapi/";
    uploadurl: string = "http://school.goyo.in:8082/images/";
    filepath: string = "www/uploads/";
    static socketurl: string = "http://school.goyo.in:8082/";
>>>>>>> origin/master

    // serviceurl: string = "http://track.goyo.in:8082/goyoapi/";
    // uploadurl: string = "http://track.goyo.in:8082/images/";
    // filepath: string = "www/uploads/";
    // static socketurl: string = "http://track.goyo.in:8082/";

    otherurl: string = "http://35.154.27.42:8081/goyoapi/";

    public static getWSDetails() {
        let _wsdetails = Cookie.get("_schwsdetails_");

        if (_wsdetails !== null) {
            return JSON.parse(_wsdetails);
        }
        else {
            return {};
        }
    }

    public static getEntityDetails() {
        let _enttdetails = Cookie.get("_schenttdetails_");

        if (_enttdetails !== null) {
            return JSON.parse(_enttdetails);
        }
        else {
            return {};
        }
    }
}