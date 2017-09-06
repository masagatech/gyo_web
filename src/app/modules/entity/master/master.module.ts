import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from '../master/master.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: MasterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
                    { path: 'notification', loadChildren: './notification#NotificationModule' },

                    // Passenger
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },
                    { path: 'passengerleave', loadChildren: './passengerleave#PassengerLeaveModule' },
                    
                    // Student
                    { path: 'student', loadChildren: './passenger#PassengerModule' },
                    { path: 'studentleave', loadChildren: './passengerleave#PassengerLeaveModule' },
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
        MasterComponent
    ],
    providers: [AuthGuard]
})

export class MasterModule {

}
