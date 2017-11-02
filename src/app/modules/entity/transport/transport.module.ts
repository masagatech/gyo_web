import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransportComponent } from '../transport/transport.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: TransportComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'schedule', loadChildren: './schedule#VehicleScheduleModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'student', loadChildren: './student#StudentVehicleModule' },
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
        TransportComponent
    ],
    providers: [AuthGuard]
})

export class TransportModule {

}
