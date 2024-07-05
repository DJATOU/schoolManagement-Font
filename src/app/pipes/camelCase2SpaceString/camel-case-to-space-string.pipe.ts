import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToSpaceString',
  standalone: true
})
export class CamelCaseToSpaceStringPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return value;
    }
    // Insère un espace avant toutes les lettres majuscules et met en majuscule la première lettre
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, function(str) { return str.toUpperCase(); });
  }

}
