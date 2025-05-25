import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None // Desactiva el encapsulamiento

})
export class AppComponent {
  title = 'Angular';
}
