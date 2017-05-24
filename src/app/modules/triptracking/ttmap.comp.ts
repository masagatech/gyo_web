import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from '../../_services/common/common-service'; /* add reference for master of master */
import { TTMapService } from '../../_services/triptracking/ttmap-service';
import { MessageService, messageType } from '../../_services/messages/message-service';
import { LoginService } from '../../_services/login/login-service';
import { LoginUserModel } from '../../_model/user_model';

declare var google: any;

@Component({
    templateUrl: 'ttmap.comp.html',
    providers: [TTMapService, CommonService]
})

export class TripTrackingComponent implements OnInit, OnDestroy {
    loginUser: LoginUserModel;

    coordDT: any = [];
    driverDT: any = [];

    coordid: number = 0;
    coordname: string = "";
    driverid: number = 0;

    tripDT: any = [];

    options: any = [];
    overlays: any = [];

    markerTitle: string = "";
    selectedPosition: any = [];

    infoWindow: any = [];

    draggable: boolean = false;

    constructor(public _ttmapservice: TTMapService, private _msg: MessageService, private _autoservice: CommonService, private _loginservice: LoginService) {
        this.loginUser = this._loginservice.getUser();
    }

    ngOnInit() {
        this.coordid = 2;
        this.coordname = "Mahesh Tiwari";
        this.fillDriverDropDown();
        this.driverid = 1;

        this.getTripData();
        this.getTTMap();
        this.initOverlays();
        this.infoWindow = new google.maps.InfoWindow();
    }

    // Auto Completed Co-ordinator / Attendent

    getCoordinatorData(event) {
        let query = event.query;

        this._autoservice.getAutoData({
            "flag": "owner",
            "uid": this.loginUser.uid,
            "typ": this.loginUser.utype,
            "otype": "coord",
            "search": query
        }).then(data => {
            this.coordDT = data;
        });
    }

    // Get Selected Auto Completed Data

    selectCoordinatorData(event) {
        this.coordid = event.value;
        this.coordname = event.label;
        this.fillDriverDropDown();
    }

    // Driver DropDown

    fillDriverDropDown() {
        var that = this;

        that._autoservice.getDropDownData({ "flag": "driver", "id": that.coordid }).subscribe((data) => {
            try {
                that.driverDT = data.data;
            }
            catch (e) {
                that._msg.Show(messageType.error, "Error", e);
            }
        }, err => {
            // that._msg.Show(messageType.error, "Error", err);
            console.log(err);
        }, () => {

        })
    }

    getTripData() {
        var that = this;

        this._ttmapservice.getTripTracking({ "driverid": that.driverid }).subscribe(data => {
            that.tripDT = data.data;
            console.log(JSON.stringify(that.tripDT));
        }, err => {
            that._msg.Show(messageType.error, "Error", err);
        }, () => {
            // console.log("Complete");
        });
    }

    getTTMap() {
        var that = this;

        var tripdata = {
            "status": 200,
            "data": [
                {
                    "_id": "59077358b9d3a72be4594dfd",
                    "tripid": 15,
                    "pdid": 2,
                    "drvid": 1,
                    "speed": 0,
                    "uid": "1",
                    "bearing": -1.302723,
                    "loctm": "2017-05-01T17:41:25.498Z",
                    "loc": [
                        19.2500675,
                        73.1426076
                    ],
                    "sertm": "2017-05-01T17:41:44.738Z",
                    "__v": 0
                }
            ]
        }

        var geoloc = tripdata.data[0].loc;

        this.options = {
            center: { lat: geoloc[0], lng: geoloc[1] },
            zoom: 12
        };
    }

    handleMapClick(event) {
        this.selectedPosition = event.latLng;
    }

    handleOverlayClick(event) {
        let isMarker = event.overlay.getTitle != undefined;

        if (isMarker) {
            let title = event.overlay.getTitle();
            this.infoWindow.setContent('' + title + '');
            this.infoWindow.open(event.map, event.overlay);
            event.map.setCenter(event.overlay.getPosition());

            this._msg.Show(messageType.info, "Info", "Marker Selected");
        }
        else {
            this._msg.Show(messageType.info, "Info", "Shape Selected");
        }
    }

    addMarker() {
        this.overlays.push(new google.maps.Marker({ position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() }, title: this.markerTitle, draggable: this.draggable }));
        this.markerTitle = null;
    }

    handleDragEnd(event) {
        this._msg.Show(messageType.info, "Info", "Marker Dragged");

        // this.msgs.push({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
    }

    initOverlays() {
        if (!this.overlays || !this.overlays.length) {
            this.overlays = [
                new google.maps.Marker({ position: { lat: 36.879466, lng: 30.667648 }, title: "Konyaalti" }),
                new google.maps.Marker({ position: { lat: 36.883707, lng: 30.689216 }, title: "Ataturk Park" }),
                new google.maps.Marker({ position: { lat: 36.885233, lng: 30.702323 }, title: "Oldtown" }),
                new google.maps.Polygon({
                    paths: [
                        { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
                    ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
                }),
                new google.maps.Circle({ center: { lat: 36.90707, lng: 30.56533 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }),
                new google.maps.Polyline({ path: [{ lat: 36.86149, lng: 30.63743 }, { lat: 36.86341, lng: 30.72463 }], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2 })
            ];
        }
    }

    zoomIn(map) {
        map.setZoom(map.getZoom() + 1);
    }

    zoomOut(map) {
        map.setZoom(map.getZoom() - 1);
    }

    clear() {
        this.overlays = [];
    }

    ngOnDestroy() {
    }
}