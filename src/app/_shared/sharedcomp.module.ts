import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterByPipe } from '../_pipe/filterby.pipe';
import { CurrencyPipe } from '../_pipe/currency.pipe';
import { GroupByPipe } from '../_pipe/groupby.pipe';
import { format } from '../_pipe/format';
import { HeaderComponent } from '../modules/usercontrol/header/header.comp';
import { LeftSideBarComponent } from '../modules/usercontrol/leftsidebar/leftsidebar.comp';
import { LeftDashboardComponent } from '../modules/usercontrol/leftdashboard/leftdb.comp';
import { OnlyNumber } from '@directives';

@NgModule({
    imports: [RouterModule, FormsModule, CommonModule],
    declarations: [FilterByPipe, CurrencyPipe, GroupByPipe, format, HeaderComponent, LeftSideBarComponent, LeftDashboardComponent, OnlyNumber],
    exports: [FilterByPipe, CurrencyPipe, GroupByPipe, format, HeaderComponent, LeftSideBarComponent, LeftDashboardComponent, OnlyNumber]
})

export class SharedComponentModule { }
