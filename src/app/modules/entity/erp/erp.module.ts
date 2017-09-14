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
                    { path: 'classroster', loadChildren: './classroster#ClassRosterModule' },
                    { path: 'assignment', loadChildren: './assignment#AssignmentModule' },
                    { path: 'notification', loadChildren: './notification#NotificationModule' },
                    { path: 'announcement', loadChildren: './announcement#AnnouncementModule' },
                    
                    { path: 'passengerleave', loadChildren: './passengerleave#PassengerLeaveModule' },
                    { path: 'studentleave', loadChildren: './passengerleave#PassengerLeaveModule' },
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
