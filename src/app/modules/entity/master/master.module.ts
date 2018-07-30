import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasterComponent } from './master.comp';
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
                    // Passenger

                    { path: 'passenger', loadChildren: './passenger#PassengerModule' },
                    { path: 'passenger/attendance', loadChildren: '../erp/attendance#AttendanceModule' },
                    { path: 'passenger/holiday', loadChildren: '../erp/holiday#HolidayModule' },
                    { path: 'passenger/leave', loadChildren: '../erp/leave#LeaveModule' },

                    // Master

                    { path: 'academicyear', loadChildren: './academicyear#AcademicYearModule' },
                    { path: 'holiday', loadChildren: './holiday#HolidayModule' },
                    { path: 'activity', loadChildren: './activity#ActivityModule' },
                    { path: 'tag', loadChildren: './tag#TagModule' },
                    { path: 'taggroupmodulemap', loadChildren: './taggrpmdlmap#TagGroupModuleMapModule' },
                    { path: 'album', loadChildren: './album#AlbumModule' },
                    { path: 'content', loadChildren: './content#EntityContentModule' },

                    // Class

                    { path: 'standard', loadChildren: './standard#StandardModule' },
                    { path: 'class', loadChildren: './class#ClassModule' },
                    { path: 'subject', loadChildren: './subject#SubjectModule' },
                    { path: 'classbooks', loadChildren: './books#BooksModule' },
                    { path: 'chapter', loadChildren: './chapter#ChapterModule' },
                    { path: 'subjectmaptoteacher', loadChildren: './submaptchr#SubjectMapToTeacherModule' },
                    { path: 'classtimetable', loadChildren: './classtimetable#ClassTimeTableModule' },
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
