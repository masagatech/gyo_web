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
                    { path: 'admission/prospectus', loadChildren: './prospectus#ProspectusModule' },
                    { path: 'prospectus/issues', loadChildren: './prospectusissues#ProspectusIssuesModule' },

                    { path: 'erp/student', loadChildren: './admission#AdmissionModule' },

                    { path: 'erp/:psngrtype', loadChildren: './employee#EmployeeModule' },

                    { path: 'erp/:psngrtype/attendance', loadChildren: './attendance#AttendanceModule' },
                    { path: 'erp/:psngrtype/leave', loadChildren: './leave#LeaveModule' },
                    { path: 'erp/:psngrtype/timetable', loadChildren: './timetable#TimetableModule' },
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
