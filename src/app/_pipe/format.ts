import { Pipe } from "@angular/core";

@Pipe({
  name: "format"
})

export class format {
  transform(date: any, args: any): any {
    let format = args.format;

    return moment(date).format(format);
  }
}