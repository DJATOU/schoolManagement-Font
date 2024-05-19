import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shared-layout-container',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './shared-layout-container.component.html',
  styleUrl: './shared-layout-container.component.scss'
})
export class SharedLayoutContainerComponent {

}
