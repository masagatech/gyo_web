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
                    { path: 'employee', loadChildren: './employee#EmployeeModule' },
                    { path: 'batch', loadChildren: './batch#BatchModule' },
                    { path: 'class', loadChildren: './class#ClassModule' },
                    { path: 'books', loadChildren: './books#BooksModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterModule' },
                    { path: 'subjectmaptoteacher', loadChildren: './submaptchr#SubjectMapToTeacherModule' },

                    // Passenger
                    // { path: 'passenger', loadChildren: './passenger#PassengerModule' },

                    // Student
                    { path: 'student', loadChildren: './student#StudentModule' },

                    { path: 'activity', loadChildren: './activity#ActivityModule' },
                    { path: 'driver', loadChildren: './driver#DriverModule' },
                    { path: 'vehicle', loadChildren: './vehicle#VehicleModule' },
                    { path: 'route', loadChildren: './route#RouteModule' },
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
