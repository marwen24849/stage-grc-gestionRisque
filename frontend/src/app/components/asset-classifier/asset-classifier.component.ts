import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClassificationService } from '../../services/classification.service';
import { ActifService } from '../../services/actif.service';

@Component({
  selector: 'app-asset-classifier',
  templateUrl: './asset-classifier.component.html',
  styleUrls: ['./asset-classifier.component.css']
})
export class AssetClassifierComponent implements OnInit, OnChanges {
  @Input() assetId: number | null = null;
  @Input() clientImageBase64: string | null | undefined = null;
  selectedNiveauId: number = 1;
  disponibiliteLevel: number = 3;
  integriteLevel: number = 3;
  confidentialiteLevel: number = 3;
  tracabiliteLevel: number = 3;

  levels = [1, 2, 3, 4];

  constructor(
    private route: ActivatedRoute,
    private svc: ClassificationService,
    private actifService: ActifService
  ) {}

  ngOnInit(): void {
    if (!this.assetId) {
      const idParam = this.route.snapshot.paramMap.get('assetId');
      if (idParam) {
        this.assetId = +idParam;
      }
    }

    this.loadAssetState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['assetId'] && this.assetId) {
      this.loadAssetState();
    }
  }

  private loadAssetState(): void {
    if (!this.assetId) return;

    this.actifService.getActifById(this.assetId).subscribe({
      next: (actif) => {
        this.selectedNiveauId = actif.niveau?.id ?? 1;
        this.disponibiliteLevel = actif.disponibiliteLevel ?? 3;
        this.integriteLevel = actif.integriteLevel ?? 3;
        this.confidentialiteLevel = actif.confidentialiteLevel ?? 3;
        this.tracabiliteLevel = actif.tracabiliteLevel ?? 3;
      },
      error: () => {
        this.selectedNiveauId = 1;
      }
    });

    this.svc.getNiveauId(this.assetId).subscribe((nid) => {
      if (nid) this.selectedNiveauId = nid;
    });
  }

  save() {
    if (!this.assetId) return;
    this.svc.saveClassification(this.assetId, {
      disponibiliteLevel: this.disponibiliteLevel,
      integriteLevel: this.integriteLevel,
      confidentialiteLevel: this.confidentialiteLevel,
      tracabiliteLevel: this.tracabiliteLevel
    }).subscribe({
      next: () => {
        this.loadAssetState();
      },
      error: (err) => alert('Erreur sauvegarde: ' + (err?.message || err))
    });
  }
}
