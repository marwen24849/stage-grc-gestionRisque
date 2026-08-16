import { Injectable } from '@angular/core';
import { ActifService } from './actif.service';
import { Observable, switchMap, of } from 'rxjs';
import { Actif } from '../models/actif.model';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  constructor(private actifService: ActifService) {}

  
  getNiveauId(assetId: number): Observable<number | undefined> {
    return this.actifService.getActifById(assetId).pipe(
      switchMap((a) => of(a.niveau?.id))
    );
  }


  saveClassification(assetId: number, values: {disponibiliteLevel?: number, integriteLevel?: number, confidentialiteLevel?: number, tracabiliteLevel?: number} ){
    return this.actifService.getActifById(assetId).pipe(
      switchMap((a) => {
        const levelValues = [
          values.disponibiliteLevel ?? a.disponibiliteLevel ?? 1,
          values.integriteLevel ?? a.integriteLevel ?? 1,
          values.confidentialiteLevel ?? a.confidentialiteLevel ?? 1,
          values.tracabiliteLevel ?? a.tracabiliteLevel ?? 1
        ];

        const maxLevel = Math.max(...levelValues);
        const payload: any = {
          nom: a.nom,
          description: a.description,
          type: a.type,
          niveauId: a.niveau?.id,
          activiteId: a.activite?.id,
          disponibiliteLevel: values.disponibiliteLevel ?? a.disponibiliteLevel,
          integriteLevel: values.integriteLevel ?? a.integriteLevel,
          confidentialiteLevel: values.confidentialiteLevel ?? a.confidentialiteLevel,
          tracabiliteLevel: values.tracabiliteLevel ?? a.tracabiliteLevel,
          niveauMax: maxLevel,
          valeur: maxLevel * 1000,
          actifSecondaire: a.actifSecondaire ?? a.type ?? 'Autre'
        };
        return this.actifService.updateActif(assetId, payload);
      })
    );
  }
}
