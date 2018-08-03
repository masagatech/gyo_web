import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule, CommonService } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NvD3Module } from 'ng2-nvd3';

import { ERPDashboardService } from '@services/erp';
import { PassengerReportsService, AssesmentReportService } from '@services/reports';

import { HelpDeskComponent } from './helpdesk.comp';
import { StudentDashboardComponent } from './student/studsdb.comp';

import { AutoCompleteModule } from 'primeng/primeng';

export const routes = [
    {
        path: '', children: [
            {
                path: '', component: HelpDeskComponent, canActivate: [AuthGuard],
                data: { "module": "", "submodule": "hd", "rights": "view", "urlname": "/helpdesk" }
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule, FormsModule, SharedComponentModule, RouterModule.forChild(routes), AutoCompleteModule, NvD3Module
    ],

    entryComponents: [StudentDashboardComponent],

    declarations: [
        HelpDeskComponent,
        StudentDashboardComponent
    ],

    providers: [AuthGuard, ERPDashboardService, PassengerReportsService, AssesmentReportService, CommonService]
})

export class HelpDeskModule {

}
