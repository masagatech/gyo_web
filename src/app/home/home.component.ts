import {
  Component,
  OnInit, OnDestroy
} from '@angular/core';

import { AppState } from '../app.service';
import { Title } from './title';
import { DashboardService } from '../_services/dashboard-service'
import { Subscription } from 'rxjs/Subscription'

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [
    Title,
    DashboardService
  ],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./home.component.css'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  // Set our default values
  public localState = { value: '' };
  private dashboardData = [];
  private colrs = ["red", "orange", "light-green", "pink", "cyan", "teal", "light-green", "green"];
  _sub: Subscription;
  // TypeScript public modifiers
  constructor(
    public appState: AppState,
    public title: Title,
    private _dashboard: DashboardService

  ) {
    this._sub = _dashboard.getDashboard({}).subscribe(_d => {
      var data = _d.data[0].funget_dashboard;
      for (var i = 0; i <= data.length - 1; i++) {
        var jsn = { "vehtype": data[i].vehtype, "counts": data[i].counts, "color": this.colrs[i] }
        this.dashboardData.push(jsn);
      }
    });
  }

  public ngOnInit() {


  }

  public ngOnDestroy() {
    this._sub.unsubscribe();
  }

  public submitState(value: string) {
    this.appState.set('value', value);
    this.localState.value = '';
  }
}
