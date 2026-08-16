import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponsableService } from '../../services/responsable.service';
import { Responsable } from '../../models/responsable.model';

@Component({
  selector: 'app-responsable-dashboard',
  standalone: false,
  templateUrl: './responsable-dashboard.component.html',
  styleUrls: ['./responsable-dashboard.component.css']
})
export class ResponsableDashboardComponent implements OnInit {
  responsables: Responsable[] = [];
  selectedResponsable: Responsable | null = null;
  isCreating = false;
  isEditing = false;
  searchTerm = '';
  loading = false;
  clientId!: number;
  clientNom: string = '';
  responsableForm!: FormGroup;

  constructor(
    private responsableService: ResponsableService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = +this.route.snapshot.paramMap.get('clientId')!;
    this.clientNom = this.route.snapshot.queryParams['nom'] || '';

    this.loading = true;
    this.responsableService.loadResponsablesByClient(this.clientId).subscribe({
      next: (data) => {
        this.responsables = data;
        this.loading = false;
        if (this.responsables.length > 0 && !this.selectedResponsable) {
          this.selectResponsable(this.responsables[0]);
          this.clientNom = this.responsables[0].clientNom || '';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement responsables', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.initForm();
  }

  initForm(responsable?: Responsable): void {
    this.responsableForm = this.fb.group({
      nom: [responsable?.nom || '', Validators.required],
      email: [responsable?.email || '', [Validators.required, Validators.email]],
      telephone: [responsable?.telephone || ''],
    });
  }

  selectResponsable(responsable: Responsable): void {
    this.selectedResponsable = responsable;
    this.isCreating = false;
    this.isEditing = false;
    this.initForm(responsable);
    this.cdr.detectChanges();
  }

  startCreate(): void {
    this.selectedResponsable = null;
    this.isCreating = true;
    this.isEditing = false;
    this.initForm();
    this.cdr.detectChanges();
  }

  startEdit(): void {
    if (this.selectedResponsable) {
      this.isEditing = true;
      this.isCreating = false;
      this.initForm(this.selectedResponsable);
      this.cdr.detectChanges();
    }
  }

  cancelForm(): void {
    if (this.isCreating) {
      this.isCreating = false;
      if (this.selectedResponsable) {
        // on garde la sélection
      } else if (this.responsables.length > 0) {
        this.selectResponsable(this.responsables[0]);
      }
    } else if (this.isEditing) {
      this.isEditing = false;
      if (this.selectedResponsable) {
        this.responsableService.getResponsableById(this.selectedResponsable.id).subscribe(r => {
          if (r) {
            this.selectedResponsable = r;
            this.initForm(r);
            this.cdr.detectChanges();
          }
        });
      }
    }
    this.cdr.detectChanges();
  }

  submitForm(): void {
    if (this.responsableForm.invalid) return;
    const formValue = this.responsableForm.value;
    const payload = { ...formValue, clientId: this.clientId };
    if (this.isCreating) {
      this.responsableService.createResponsable(payload).subscribe({
        next: (newResp) => {
          this.responsables = [...this.responsables, newResp];
          this.selectResponsable(newResp);
          this.isCreating = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur création', err)
      });
    } else if (this.isEditing && this.selectedResponsable) {
      this.responsableService.updateResponsable(this.selectedResponsable.id, formValue).subscribe({
        next: (updated) => {
          const index = this.responsables.findIndex(r => r.id === updated.id);
          if (index !== -1) this.responsables[index] = updated;
          this.selectedResponsable = updated;
          this.isEditing = false;
          this.initForm(updated);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur mise à jour', err)
      });
    }
  }

  deleteResponsable(): void {
    if (this.selectedResponsable && confirm('Voulez-vous vraiment supprimer ce responsable ?')) {
      this.responsableService.deleteResponsable(this.selectedResponsable.id, this.clientId).subscribe({
        next: () => {
          this.responsables = this.responsables.filter(r => r.id !== this.selectedResponsable!.id);
          this.selectedResponsable = null;
          this.isCreating = false;
          this.isEditing = false;
          if (this.responsables.length > 0) {
            this.selectResponsable(this.responsables[0]);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  // ---- AJOUT : navigation vers les activités du responsable sélectionné ----
  goToActivites(): void {
    if (this.selectedResponsable) {
      this.router.navigate(['/activites', this.selectedResponsable.id], {
        queryParams: { nom: this.selectedResponsable.nom }
      });
    }
  }

  get filteredResponsables(): Responsable[] {
    if (!this.searchTerm.trim()) return this.responsables;
    const term = this.searchTerm.toLowerCase();
    return this.responsables.filter(
      (r) =>
        (r.nom?.toLowerCase().includes(term) || false) ||
        (r.email?.toLowerCase().includes(term) || false)
    );
  }

  getFullName(r: Responsable): string {
    return r.prenom ? `${r.prenom} ${r.nom}` : r.nom;
  }

  getInitials(r: Responsable): string {
    const first = r.prenom ? r.prenom.charAt(0) : '';
    const last = r.nom ? r.nom.charAt(0) : '';
    return (first + last).toUpperCase() || '?';
  }
}