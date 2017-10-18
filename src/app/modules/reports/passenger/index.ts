import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    // Student
                    
                    { path: '', loadChildren: './student#StudentReportsModule' },
                    { path: 'birthday', loadChildren: './studentbirthday#StudentBirthdayModule' },

                    // Passenger
                    
                    { path: 'trips', loadChildren: './passengertrips#PassengerTripsReportsModule' },
                    { path: 'routewise', loadChildren: './routewisepassenger#RouteWisePassengerModule' },
                    { path: 'direct', loadChildren: './directpassenger#DirectPassengerModule' },
                    { path: 'unschedule', loadChildren: './unschedulepassenger#UnschedulePassengerModule' },
                    { path: 'leave', loadChildren: './passengerleave#PassengerLeaveModule' },
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
    providers: [AuthGuard]
})

export class PassengerReportsModule {

}
