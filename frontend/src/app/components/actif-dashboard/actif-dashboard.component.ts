import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Actif, ActifCreate } from '../../models/actif.model';
import { ActifService } from '../../services/actif.service';

interface NiveauOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-actif-dashboard',
  templateUrl: './actif-dashboard.component.html',
  styleUrls: ['./actif-dashboard.component.css']
})
export class ActifDashboardComponent implements OnInit {
  actifs: Actif[] = [];
  selectedActif: Actif | null = null;
  isCreating = false;
  isEditing = false;
  showClassifier = false;
  searchTerm = '';
  loading = false;
  activiteId: number | null = null;
  activiteNom = '';
  actifForm!: FormGroup;

  niveaux: NiveauOption[] = [
    { id: 1, label: 'Niveau 1 - Libre' },
    { id: 2, label: 'Niveau 2 - Restreint' },
    { id: 3, label: 'Niveau 3 - Confidentiel' },
    { id: 4, label: 'Niveau 4 - Souverain' }
  ];

  constructor(
    private actifService: ActifService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('activiteId');
    if (idParam) {
      this.activiteId = +idParam;
      this.loadActifs();
    }
    this.activiteNom = this.route.snapshot.queryParams['nom'] || '';
    this.initForm();
  }

  initForm(actif?: Actif): void {
    this.actifForm = this.fb.group({
      nom: [actif?.nom || '', Validators.required],
      description: [actif?.description || ''],
      type: [actif?.type || ''],
      actifSecondaire: [actif?.actifSecondaire || ''],
      parentId: [actif?.parentId ?? null],
      niveauId: [actif?.niveau?.id || 1, Validators.required],
      disponibiliteLevel: [actif?.disponibiliteLevel ?? 3],
      integriteLevel: [actif?.integriteLevel ?? 3],
      confidentialiteLevel: [actif?.confidentialiteLevel ?? 3],
      tracabiliteLevel: [actif?.tracabiliteLevel ?? 3],
      niveauMax: [{ value: actif?.niveauMax ?? 3, disabled: true }],
      valeur: [{ value: actif?.valeur ?? 3000, disabled: true }]
    });

    this.bindDerivedValues();
    this.updateDerivedValues();
  }

  private bindDerivedValues(): void {
    const controls = [
      'disponibiliteLevel',
      'integriteLevel',
      'confidentialiteLevel',
      'tracabiliteLevel'
    ];

    controls.forEach((controlName) => {
      this.actifForm.get(controlName)?.valueChanges.subscribe(() => this.updateDerivedValues());
    });
  }

  private updateDerivedValues(): void {
    const values = [
      Number(this.actifForm.get('disponibiliteLevel')?.value ?? 0),
      Number(this.actifForm.get('integriteLevel')?.value ?? 0),
      Number(this.actifForm.get('confidentialiteLevel')?.value ?? 0),
      Number(this.actifForm.get('tracabiliteLevel')?.value ?? 0)
    ];

    const maxLevel = values.length > 0 ? Math.max(...values) : 1;

    this.actifForm.get('niveauMax')?.setValue(maxLevel, { emitEvent: false });
    this.actifForm.get('valeur')?.setValue(maxLevel * 1000, { emitEvent: false });
  }

  loadActifs(): void {
    if (!this.activiteId) return;
    this.loading = true;
    this.actifService.loadActifsByActivite(this.activiteId).subscribe({
      next: (data) => {
        this.actifs = data;
        this.loading = false;
        if (this.actifs.length > 0 && !this.selectedActif) {
          this.selectActif(this.actifs[0]);
          this.activiteNom = this.actifs[0].activite?.nom || this.activiteNom;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erreur chargement actifs', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  selectActif(actif: Actif): void {
    this.selectedActif = actif;
    this.isCreating = false;
    this.isEditing = false;
    this.showClassifier = false;
    this.initForm(actif);
    this.cdr.detectChanges();
  }

  toggleClassifier(actif: Actif, event?: Event): void {
    event?.stopPropagation();
    this.selectedActif = actif;
    this.showClassifier = true;
    this.isCreating = false;
    this.isEditing = false;
    this.initForm(actif);
    this.cdr.detectChanges();
  }

  closeClassifier(): void {
    this.showClassifier = false;
    this.cdr.detectChanges();
  }

  startCreate(): void {
    this.selectedActif = null;
    this.isCreating = true;
    this.isEditing = false;
    this.initForm();
    this.cdr.detectChanges();
  }

  startEdit(): void {
    if (this.selectedActif) {
      this.isEditing = true;
      this.isCreating = false;
      this.initForm(this.selectedActif);
      this.cdr.detectChanges();
    }
  }

  cancelForm(): void {
    if (this.isCreating) {
      this.isCreating = false;
      if (this.selectedActif) {
      } else if (this.actifs.length > 0) {
        this.selectActif(this.actifs[0]);
      }
    } else if (this.isEditing) {
      this.isEditing = false;
      if (this.selectedActif) {
        this.actifService.getActifById(this.selectedActif.id).subscribe((a) => {
          this.selectedActif = a;
          this.initForm(a);
          this.cdr.detectChanges();
        });
      }
    }
    this.cdr.detectChanges();
  }

  submitForm(): void {
    if (this.actifForm.invalid || !this.activiteId) return;
    this.updateDerivedValues();

    const formValue = this.actifForm.getRawValue();
    const payload: ActifCreate = {
      nom: formValue.nom,
      description: formValue.description,
      type: formValue.type,
      actifSecondaire: formValue.actifSecondaire || formValue.type || 'Autre',
      niveauId: Number(formValue.niveauId),
      activiteId: this.activiteId,
      parentId: formValue.parentId ? Number(formValue.parentId) : null,
      disponibiliteLevel: Number(formValue.disponibiliteLevel),
      integriteLevel: Number(formValue.integriteLevel),
      confidentialiteLevel: Number(formValue.confidentialiteLevel),
      tracabiliteLevel: Number(formValue.tracabiliteLevel),
      niveauMax: Number(formValue.niveauMax),
      valeur: Number(formValue.valeur),
    };

    if (this.isCreating) {
      this.actifService.createActif(payload).subscribe({
        next: (newActif) => {
          this.actifs = [...this.actifs, newActif];
          this.selectActif(newActif);
          this.isCreating = false;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur création', err)
      });
    } else if (this.isEditing && this.selectedActif) {
      this.actifService.updateActif(this.selectedActif.id, payload).subscribe({
        next: (updated) => {
          const index = this.actifs.findIndex((a) => a.id === updated.id);
          if (index !== -1) this.actifs[index] = updated;
          this.selectedActif = updated;
          this.isEditing = false;
          this.initForm(updated);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur mise à jour', err)
      });
    }
  }

  deleteActif(): void {
    if (this.selectedActif && confirm('Voulez-vous vraiment supprimer cet actif ?')) {
      this.actifService.deleteActif(this.selectedActif.id).subscribe({
        next: () => {
          this.actifs = this.actifs.filter((a) => a.id !== this.selectedActif!.id);
          this.selectedActif = null;
          this.isCreating = false;
          this.isEditing = false;
          if (this.actifs.length > 0) {
            this.selectActif(this.actifs[0]);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erreur suppression', err)
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/activites', this.route.snapshot.queryParams['responsableId'] || '']);
  }

  get filteredActifs(): Actif[] {
    if (!this.searchTerm.trim()) return this.actifs;
    const term = this.searchTerm.toLowerCase();
    return this.actifs.filter(
      (a) =>
        (a.nom?.toLowerCase().includes(term) || false) ||
        (a.description?.toLowerCase().includes(term) || false) ||
        (a.type?.toLowerCase().includes(term) || false)
    );
  }

  getInitials(a: Actif): string {
    return a.nom ? a.nom.charAt(0).toUpperCase() : '?';
  }
}
