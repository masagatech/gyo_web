import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '../../../_services/authguard-service';

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
                    { path: 'loginlog', loadChildren: './loginlog#LoginLogModule' },
                    { path: 'menulog', loadChildren: './menulog#MenuLogModule' },
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

export class LogReportsModule {

}
