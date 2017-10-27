import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPComponent } from '../erp/erp.comp';
import { AuthGuard, SharedComponentModule } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ERPComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'erp', loadChildren: './dashboard#ERPDashboardModule' },
                    { path: 'admission/prospectus', loadChildren: './prospectus#ProspectusModule' },
                    { path: 'prospectus/issues', loadChildren: './prospectusissues#ProspectusIssuesModule' },

                    { path: 'student', loadChildren: './admission#AdmissionModule' },

                    { path: ':psngrtype', loadChildren: './employee#EmployeeModule' },

                    { path: ':psngrtype/attendance', loadChildren: './attendance#AttendanceModule' },
                    { path: ':psngrtype/leave', loadChildren: './leave#LeaveModule' },
                    { path: ':psngrtype/timetable', loadChildren: './timetable#TimetableModule' },
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
        ERPComponent
    ],
    providers: [AuthGuard]
})

export class ERPModule {

}
