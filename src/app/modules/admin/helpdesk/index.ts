import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService, DashboardService } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HelpDeskComponent } from './helpdesk.comp';
import { StudentDashboardComponent } from './student/studsdb.comp';
import { UserDashboardComponent } from './users/userdb.comp';
import { VehicleDashboardComponent } from './vehicle/vehdb.comp';

import { AutoCompleteModule, DataGridModule, PanelModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            {
                path: '', component: HelpDeskComponent, canActivate: [AuthGuard],
                data: { "module": "", "submodule": "hd", "rights": "allowed", "urlname": "/helpdesk" }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes),
        AutoCompleteModule, DataGridModule, PanelModule
    ],

    entryComponents: [StudentDashboardComponent, UserDashboardComponent, VehicleDashboardComponent],

    declarations: [
        HelpDeskComponent,
        StudentDashboardComponent,
        UserDashboardComponent,
        VehicleDashboardComponent
    ],

    providers: [AuthGuard, CommonService, DashboardService]
})

export class HelpDeskModule {

}
