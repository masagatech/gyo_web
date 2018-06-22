import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterByPipe } from '../_pipe/filterby.pipe';
import { CurrencyPipe } from '../_pipe/currency.pipe';
import { GroupByPipe } from '../_pipe/groupby.pipe';
import { HeaderComponent } from '../modules/usercontrol/header/header.comp';
import { LeftSideBarComponent } from '../modules/usercontrol/leftsidebar/leftsidebar.comp';
import { LeftDashboardComponent } from '../modules/usercontrol/leftdashboard/leftdb.comp';
import { ADHOST, OnlyNumber } from '@directives';
import { TimesAgoPipe } from '@pipe/timeago';
import { format } from '@pipe/format';

import { AutoCompleteModule } from 'primeng/primeng';

@NgModule({
    imports: [RouterModule, FormsModule, CommonModule, AutoCompleteModule],
    declarations: [FilterByPipe, CurrencyPipe, GroupByPipe, HeaderComponent, LeftSideBarComponent,
        LeftDashboardComponent, ADHOST, OnlyNumber, TimesAgoPipe, format],
    exports: [FilterByPipe, CurrencyPipe, GroupByPipe, HeaderComponent, LeftSideBarComponent,
        LeftDashboardComponent, ADHOST, OnlyNumber, TimesAgoPipe, format]
})

export class SharedComponentModule { }
