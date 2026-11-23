import { Component } from '@angular/core';
import packageJson from '../../package.json';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bingoApp';
  version = packageJson.version;
}
