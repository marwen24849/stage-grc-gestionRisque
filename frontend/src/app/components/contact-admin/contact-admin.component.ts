import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-admin',
  templateUrl: './contact-admin.component.html',
  styleUrls: ['./contact-admin.component.css']
})
export class ContactAdminComponent {
  submitted = false;

  onSubmit(): void {
    this.submitted = true;
  }
}
