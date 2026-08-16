// client-dashboard.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';

@Component({
  selector: 'app-client-dashboard',
  standalone: false, // si vous utilisez un module, mettez false
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.css']
})
export class ClientDashboardComponent implements OnInit {
  clients: Client[] = [];
  selectedClient: Client | null = null;
  isCreating = false;
  isEditing = false;
  searchTerm = '';
  loading = false;
  clientForm!: FormGroup;

  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients = data;
        this.loading = false;
        if (this.clients.length > 0 && !this.selectedClient) {
          this.selectClient(this.clients[0]);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement clients', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.initForm();
  }

  initForm(client?: Client): void {
    this.clientForm = this.fb.group({
      nom: [client?.nom || '', Validators.required],
      email: [client?.email || '', [Validators.required, Validators.email]],
      telephone: [client?.telephone || ''],
      adresse: [client?.adresse || ''],
    });
  }

  selectClient(client: Client): void {
    this.selectedClient = client;
    this.isCreating = false;
    this.isEditing = false;
    this.initForm(client);
    this.cdr.detectChanges();
  }

  startCreate(): void {
    this.selectedClient = null;
    this.isCreating = true;
    this.isEditing = false;
    this.initForm();
    this.cdr.detectChanges();
  }

  startEdit(): void {
    if (this.selectedClient) {
      this.isEditing = true;
      this.isCreating = false;
      this.initForm(this.selectedClient);
      this.cdr.detectChanges();
    }
  }

  cancelForm(): void {
    if (this.isCreating) {
      this.isCreating = false;
      if (this.selectedClient) {
        // on garde la sélection
      } else if (this.clients.length > 0) {
        this.selectClient(this.clients[0]);
      }
    } else if (this.isEditing) {
      this.isEditing = false;
      if (this.selectedClient) {
        this.clientService.getClientById(this.selectedClient.id).subscribe(c => {
          if (c) {
            this.selectedClient = c;
            this.initForm(c);
            this.cdr.detectChanges();
          }
        });
      }
    }
    this.cdr.detectChanges();
  }

  submitForm(): void {
    if (this.clientForm.invalid) return;
    const formValue = this.clientForm.value;
    if (this.isCreating) {
      this.clientService.createClient(formValue).subscribe({
        next: (newClient) => {
          this.clients = [...this.clients, newClient];
          this.selectClient(newClient);
          this.isCreating = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur création', err)
      });
    } else if (this.isEditing && this.selectedClient) {
      this.clientService.updateClient(this.selectedClient.id, formValue).subscribe({
        next: (updated) => {
          const index = this.clients.findIndex(c => c.id === updated.id);
          if (index !== -1) this.clients[index] = updated;
          this.selectedClient = updated;
          this.isEditing = false;
          this.initForm(updated);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur mise à jour', err)
      });
    }
  }

  deleteClient(): void {
    if (this.selectedClient && confirm('Voulez-vous vraiment supprimer ce client ?')) {
      this.clientService.deleteClient(this.selectedClient.id).subscribe({
        next: () => {
          this.clients = this.clients.filter(c => c.id !== this.selectedClient!.id);
          this.selectedClient = null;
          this.isCreating = false;
          this.isEditing = false;
          if (this.clients.length > 0) {
            this.selectClient(this.clients[0]);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  get filteredClients(): Client[] {
    if (!this.searchTerm.trim()) return this.clients;
    const term = this.searchTerm.toLowerCase();
    return this.clients.filter(
      (c) =>
        c.nom.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        (c.adresse && c.adresse.toLowerCase().includes(term))
    );
  }

  getInitials(client: Client): string {
    return client.nom ? client.nom.charAt(0).toUpperCase() : '?';
  }
}