import { Pipe } from '@angular/core';
import { PipeTransform } from '@angular/core';

@Pipe({
  name: 'hex',
})
export class HexPipe implements PipeTransform {
  transform(value: ArrayBuffer): string[] {
    const result = Array.from(new Uint8Array(value)).map(x => '0x' + x.toString(16));
    console.log(value, result);
    return result;
  }
}
