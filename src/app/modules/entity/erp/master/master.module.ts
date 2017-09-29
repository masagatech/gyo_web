import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ERPMasterComponent } from '../master/master.comp';
import { AuthGuard } from '@services';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export const routes = [
    {
        path: '',
        component: ERPMasterComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                children: [
                    { path: 'academicyear', loadChildren: './academicyear#AcademicYearModule' },
                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'taggroupmodulemap', loadChildren: './taggrpmdlmap#TagGroupModuleMapModule' },
                    { path: 'attendance', loadChildren: './attendance#AttendanceModule' },
                    { path: 'leave', loadChildren: './passengerleave#PassengerLeaveModule' },
                    { path: 'album', loadChildren: './album#AlbumModule' },
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
        ERPMasterComponent
    ],
    providers: [AuthGuard]
})

export class ERPMasterModule {

}
