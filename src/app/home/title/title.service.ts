import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class Title {
  public value = 'Angular 2';

  constructor(public http: Http) { }

  public getData() {
    return {
      value: 'AngularClass'
    };
  }

}
