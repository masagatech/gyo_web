import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FilterByPipe } from '../_pipe/filterby.pipe';
import { CurrencyPipe } from '../_pipe/currency.pipe';
import { GroupByPipe } from '../_pipe/groupby.pipe';

@NgModule({
    imports: [RouterModule, FormsModule, CommonModule],
    declarations: [FilterByPipe, CurrencyPipe, GroupByPipe],
    exports: [FilterByPipe, CurrencyPipe, GroupByPipe]
})

export class SharedComponentModule { }
