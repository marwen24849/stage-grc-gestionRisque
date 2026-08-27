import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../models/client.model';
import { Role } from '../../models/auth.model';
import { ManagedUser } from '../../models/user.model';
import { ClientService } from '../../services/client.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: ManagedUser[] = [];
  clients: Client[] = [];
  userForm!: FormGroup;
  searchTerm = '';
  selectedRole: Role | 'ALL' = 'ALL';
  selectedUser: ManagedUser | null = null;
  showForm = false;
  loading = false;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  readonly roles: Role[] = ['ADMIN', 'CONSULTANT', 'CLIENT'];

  constructor(
    private readonly userService: UserService,
    private readonly clientService: ClientService,
    private readonly formBuilder: FormBuilder,
    private readonly changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.loadUsers();
    this.clientService.loadClients().subscribe({
      next: clients => this.clients = clients,
      error: () => this.clients = []
    });
  }

  buildForm(): void {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['CONSULTANT' as Role, Validators.required],
      clientId: [null],
      assignedClientIds: [[]]
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger les utilisateurs.';
        this.loading = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  startCreate(): void {
    this.selectedUser = null;
    this.showForm = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.buildForm();
  }

  cancelCreate(): void {
    this.showForm = false;
    this.selectedUser = null;
    this.errorMessage = '';
    this.userForm.reset({ role: 'CONSULTANT', clientId: null, assignedClientIds: [] });
  }

  submit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    const value = this.userForm.getRawValue();
    const request = {
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim(),
      password: value.password,
      role: value.role,
      clientId: value.role === 'CLIENT' ? value.clientId : null,
      assignedClientIds: value.role === 'CONSULTANT' ? value.assignedClientIds || [] : []
    };

    this.userService.createUser(request).subscribe({
      next: user => {
        this.users = [user, ...this.users];
        this.successMessage = 'Utilisateur créé avec succès.';
        this.submitting = false;
        this.cancelCreate();
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.errorMessage = error?.error?.message || 'La création de l’utilisateur a échoué.';
        this.submitting = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  toggleEnabled(user: ManagedUser): void {
    const enabled = user.enabled === false;
    this.userService.setEnabled(user.id, enabled).subscribe({
      next: () => user.enabled = enabled,
      error: error => this.errorMessage = error?.error?.message || 'Impossible de modifier le statut.'
    });
  }

  deleteUser(user: ManagedUser): void {
    if (!confirm(`Supprimer le compte de ${user.firstName} ${user.lastName} ?`)) {
      return;
    }
    this.userService.deleteUser(user.id).subscribe({
      next: () => this.users = this.users.filter(item => item.id !== user.id),
      error: error => this.errorMessage = error?.error?.message || 'Impossible de supprimer cet utilisateur.'
    });
  }

  get filteredUsers(): ManagedUser[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.users.filter(user => {
      const matchesSearch = !term || `${user.firstName} ${user.lastName} ${user.email}`.toLowerCase().includes(term);
      const matchesRole = this.selectedRole === 'ALL' || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  get activeCount(): number {
    return this.users.filter(user => user.enabled !== false).length;
  }

  get consultantsCount(): number {
    return this.users.filter(user => user.role === 'CONSULTANT').length;
  }

  get clientsCount(): number {
    return this.users.filter(user => user.role === 'CLIENT').length;
  }

  getInitials(user: ManagedUser): string {
    return `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase();
  }

  roleLabel(role: Role): string {
    return role === 'ADMIN' ? 'Administrateur' : role === 'CONSULTANT' ? 'Consultant' : 'Client';
  }

  isRole(role: Role): boolean {
    return this.userForm?.get('role')?.value === role;
  }
}
