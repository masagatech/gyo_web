import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPPassengerComponent } from '../passenger/passenger.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ERPPassengerComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'birthday', loadChildren: './birthday#BirthdayModule' },
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
        ERPPassengerComponent
    ],
    providers: [AuthGuard]
})

export class ERPPassengerModule {

}
