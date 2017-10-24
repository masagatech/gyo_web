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
                    { path: 'class', loadChildren: './class#ClassModule' },
                    { path: 'books', loadChildren: './books#BooksModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterModule' },
                    { path: 'subjectmaptoteacher', loadChildren: './submaptchr#SubjectMapToTeacherModule' },

                    // Passenger
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },

                    // Student
                    { path: 'editstudent', loadChildren: './student#StudentModule' },

                    { path: 'academicyear', loadChildren: './academicyear#AcademicYearModule' },

                    { path: 'activity', loadChildren: './activity#ActivityModule' },
                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'taggroupmodulemap', loadChildren: './taggrpmdlmap#TagGroupModuleMapModule' },
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
        MasterComponent
    ],
    providers: [AuthGuard]
})

export class MasterModule {

}
