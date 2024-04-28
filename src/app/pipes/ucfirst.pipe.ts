import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  standalone: true,
  name: 'ucfirst',
})
export class UcfirstPipe implements PipeTransform {
  transform(value: string | null) {
    if (value && value.length > 0) {
    return value[0].toUpperCase() + value?.substring(1);
    } else {
    return value;
    }
  }
}
