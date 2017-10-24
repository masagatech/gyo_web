import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ReportsComponent } from '../reports/reports.comp';

export const routes = [
    {
        path: '',
        component: ReportsComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: '', loadChildren: './erp#ERPReportsModule' },
                    { path: 'log', loadChildren: './log#LogReportsModule' },
                    { path: 'workspace', loadChildren: './workspace#WorkspaceReportsModule' },
                    { path: 'master', loadChildren: './master#MasterReportsModule' },

                    { path: 'student', loadChildren: './passenger#PassengerReportsModule' },
                    { path: 'passenger', loadChildren: './passenger#PassengerReportsModule' },
                    { path: 'attendance', loadChildren: './attendance#AttendanceReportsModule' },
                    
                    { path: 'speed', loadChildren: './speed#SpeedReportsModule' },
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        SharedComponentModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [
        ReportsComponent
    ],
    providers: [AuthGuard]
})

export class ReportsModule {

}
