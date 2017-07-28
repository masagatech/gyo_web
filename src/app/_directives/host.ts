import { Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[ADHOST]'
})
export class ADHOST {

  constructor(public viewContainerRef: ViewContainerRef) { }

}