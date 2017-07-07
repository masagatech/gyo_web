import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterByPipe } from '../_pipe/filterby.pipe';
import { CurrencyPipe } from '../_pipe/currency.pipe';
import { GroupByPipe } from '../_pipe/groupby.pipe';
import { HeaderComponent } from '../modules/usercontrol/header/header.comp';
import { LeftSideBarComponent } from '../modules/usercontrol/leftsidebar/leftsidebar.comp';
// import { NoPageComponent } from '../no-page';

@NgModule({
    imports: [RouterModule, FormsModule, CommonModule],
    declarations: [FilterByPipe, CurrencyPipe, GroupByPipe, HeaderComponent, LeftSideBarComponent],
    exports: [FilterByPipe, CurrencyPipe, GroupByPipe, HeaderComponent, LeftSideBarComponent]
})

export class SharedComponentModule { }
