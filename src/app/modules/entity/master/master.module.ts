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
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    
                    { path: 'class', loadChildren: './class#ClassModule' },
                    { path: 'classbooks', loadChildren: './books#BooksModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterModule' },
                    { path: 'subjectmaptoteacher', loadChildren: './submaptchr#SubjectMapToTeacherModule' },
                    { path: 'classtimetable', loadChildren: './classtimetable#ClassTimeTableModule' },

                    // Passenger
                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },

                    { path: 'academicyear', loadChildren: './academicyear#AcademicYearModule' },

                    { path: 'activity', loadChildren: './activity#ActivityModule' },
                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'taggroupmodulemap', loadChildren: './taggrpmdlmap#TagGroupModuleMapModule' },
                    { path: 'album', loadChildren: './album#AlbumModule' },
                    { path: 'content', loadChildren: './content#EntityContentModule' },
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
