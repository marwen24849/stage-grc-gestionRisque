import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Activite } from '../../models/activite.model';
import { ActiviteService } from '../../services/activite-service.service';

@Component({
  selector: 'app-activite-dashboard',
  standalone: false,
  templateUrl: './activite-dashboard.component.html',
  styleUrls: ['./activite-dashboard.component.css']
})
export class ActiviteDashboardComponent implements OnInit {
  activites: Activite[] = [];
  selectedActivite: Activite | null = null;
  isCreating = false;
  isEditing = false;
  searchTerm = '';
  loading = false;
  responsableId!: number;
  responsableNom: string = '';
  activiteForm!: FormGroup;

  constructor(
    private activiteService: ActiviteService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.responsableId = +this.route.snapshot.paramMap.get('responsableId')!;
    this.responsableNom = this.route.snapshot.queryParams['nom'] || '';

    this.loading = true;
    this.activiteService.loadActivitesByResponsable(this.responsableId).subscribe({
      next: (data) => {
        this.activites = data;
        this.loading = false;
        if (this.activites.length > 0 && !this.selectedActivite) {
          this.selectActivite(this.activites[0]);
          this.responsableNom = this.activites[0].responsableNom || this.responsableNom;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement activités', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    this.initForm();
  }

  initForm(activite?: Activite): void {
    this.activiteForm = this.fb.group({
      nom: [activite?.nom || '', Validators.required],
      description: [activite?.description || ''],
    });
  }

  selectActivite(activite: Activite): void {
    this.selectedActivite = activite;
    this.isCreating = false;
    this.isEditing = false;
    this.initForm(activite);
    this.cdr.detectChanges();
  }

  startCreate(): void {
    this.selectedActivite = null;
    this.isCreating = true;
    this.isEditing = false;
    this.initForm();
    this.cdr.detectChanges();
  }

  startEdit(): void {
    if (this.selectedActivite) {
      this.isEditing = true;
      this.isCreating = false;
      this.initForm(this.selectedActivite);
      this.cdr.detectChanges();
    }
  }

  cancelForm(): void {
    if (this.isCreating) {
      this.isCreating = false;
      if (this.selectedActivite) {
        // on garde la sélection
      } else if (this.activites.length > 0) {
        this.selectActivite(this.activites[0]);
      }
    } else if (this.isEditing) {
      this.isEditing = false;
      if (this.selectedActivite) {
        this.activiteService.getActiviteById(this.selectedActivite.id).subscribe(a => {
          if (a) {
            this.selectedActivite = a;
            this.initForm(a);
            this.cdr.detectChanges();
          }
        });
      }
    }
    this.cdr.detectChanges();
  }

  submitForm(): void {
    if (this.activiteForm.invalid) return;
    const formValue = this.activiteForm.value;
    const payload = { ...formValue, responsableId: this.responsableId };
    if (this.isCreating) {
      this.activiteService.createActivite(payload).subscribe({
        next: (newActivite) => {
          this.activites = [...this.activites, newActivite];
          this.selectActivite(newActivite);
          this.isCreating = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur création', err)
      });
    } else if (this.isEditing && this.selectedActivite) {
      formValue.responsableId = this.responsableId; 
      this.activiteService.updateActivite(this.selectedActivite.id, formValue).subscribe({
        next: (updated) => {
          const index = this.activites.findIndex(a => a.id === updated.id);
          if (index !== -1) this.activites[index] = updated;
          this.selectedActivite = updated;
          this.isEditing = false;
          this.initForm(updated);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur mise à jour', err)
      });
    }
  }

  deleteActivite(): void {
    if (this.selectedActivite && confirm('Voulez-vous vraiment supprimer cette activité ?')) {
      this.activiteService.deleteActivite(this.selectedActivite.id, this.responsableId).subscribe({
        next: () => {
          this.activites = this.activites.filter(a => a.id !== this.selectedActivite!.id);
          this.selectedActivite = null;
          this.isCreating = false;
          this.isEditing = false;
          if (this.activites.length > 0) {
            this.selectActivite(this.activites[0]);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
    // Remplacez par `this.location.back()` (Location de @angular/common)
    // si vous préférez revenir exactement à la fiche du responsable
    // précédemment consultée plutôt qu'à la racine.
  }

  goToActfs(): void {
    if (this.selectedActivite) {
      this.router.navigate(['/activites', this.selectedActivite.id, 'actifs'], {
        relativeTo: this.route
      });
    }
  }

  get filteredActivites(): Activite[] {
    if (!this.searchTerm.trim()) return this.activites;
    const term = this.searchTerm.toLowerCase();
    return this.activites.filter(
      (a) =>
        (a.nom?.toLowerCase().includes(term) || false) ||
        (a.description?.toLowerCase().includes(term) || false)
    );
  }

  getInitials(a: Activite): string {
    return a.nom ? a.nom.charAt(0).toUpperCase() : '?';
  }
}