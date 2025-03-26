import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup, FormControl} from '@angular/forms';
import {ReactiveFormsModule, Validators} from '@angular/forms';
import { OriginService } from './origin.service';


@Component({
  selector: 'app-root',
  imports: [FormsModule, ReactiveFormsModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cfg5';
  apikey = 'L7rOxY78SK2-XpL7dsGipWcCJ818DRWE6xGfjB2eiheQcjLnEHUxXfqrGil9K405';
  backend = inject(OriginService);
  websiteForm = new FormGroup({
    domain: new FormControl('', [Validators.required, Validators.pattern('.*')]),
    origin: new FormControl('', [Validators.required, Validators.pattern('.*')]),
  })


  getConfig() {}

  submitConfig() {
  }  
}
