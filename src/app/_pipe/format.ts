import { Pipe } from "@angular/core";

@Pipe({
  name: "format"
})

export class format {
  transform(date: any, args: any): any {
      let type = args.type;
      let format = args.format;
      
     
    return  moment(date).format(format);
    // toFixed(args.decimals).toString();
  }
}