import { Component } from '@angular/core';

@Component({
  selector: 'app-access-denied',
  standalone: false,
  template: '<main><h1>Accès refusé</h1><a routerLink="/dashboard">Retour au tableau de bord</a></main>'
})
export class AccessDeniedComponent {}
