import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntityComponent } from '../entity/entity.comp';
import { AuthGuard } from '../../_services/authguard-service';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: EntityComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
                    { path: 'leavepassenger', loadChildren: './leavepassenger#LeavePassengerModule' },
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
        EntityComponent
    ],
    providers: [AuthGuard]
})

export class EntityModule {

}
