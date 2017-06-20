import { Injectable } from '@angular/core';
import { DataService } from '../../dataconnect';
import { Router } from '@angular/router';

@Injectable()
export class WorkspaceService {
    constructor(private _dataserver: DataService, private _router: Router) { }

    getWorkspaceDetails(req: any) {
        return this._dataserver.post("getWorkspaceDetails", req)
    }

    saveWorkspaceInfo(req: any) {
        return this._dataserver.post("saveWorkspaceInfo", req)
    }
}