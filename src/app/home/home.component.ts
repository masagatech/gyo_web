import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppState } from '../app.service';
import { Title } from './title';
import { DashboardService } from '../_services/dashboard-service'
import { Subscription } from 'rxjs/Subscription'

@Component({
  selector: 'home',
  providers: [Title, DashboardService],
  styleUrls: ['./home.component.css'],
  templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit, OnDestroy {
  private localState = { value: '' };
  private dashboardData = [];
  private colrs = ["red", "orange", "light-green", "pink", "cyan", "teal", "light-green", "green"];
  _sub: Subscription;

  constructor(public appState: AppState, public title: Title, private _dashboard: DashboardService) {
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