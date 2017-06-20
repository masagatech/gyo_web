import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScheduleComponent } from '../schedule/schedule.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ScheduleComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'triptracking', loadChildren: './triptracking#TripTrackingModule' },
                    { path: 'createschedule', loadChildren: './createschedule#CreateScheduleModule' },
                    { path: 'changeschedule', loadChildren: './changeschedule#ChangeScheduleModule' }
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes),
        FormsModule,
        CommonModule,
    ],
    declarations: [
        ScheduleComponent
    ],
    providers: [AuthGuard]
})

export class ScheduleModule {

}
