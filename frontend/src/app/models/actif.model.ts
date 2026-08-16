// src/app/models/actif.model.ts

export interface NiveauClassification {
  id: number;
  niveau: number;
  disponibilite: string;
  integrite: string;
  confidentialite: string;
  tracabilite: string;
}

export interface ActiviteReference {
  id: number;
  nom: string;
  description?: string;
  responsableId?: number;
  responsableNom?: string;
}

export interface Actif {
  id: number;
  nom: string;
  description?: string;
  type?: string;
  niveau?: NiveauClassification;
  activite?: ActiviteReference;
  parentId?: number;
  enfants?: Actif[];
  createdAt: string;
  updatedAt: string;
  disponibiliteLevel?: number;
  integriteLevel?: number;
  confidentialiteLevel?: number;
  tracabiliteLevel?: number;
  niveauMax?: number;
  valeur?: number;
  actifSecondaire?: string;
}

export interface ActifCreate {
  nom: string;
  description?: string;
  type?: string;
  niveauId: number;
  activiteId: number;
  parentId?: number | null;
  disponibiliteLevel?: number;
  integriteLevel?: number;
  confidentialiteLevel?: number;
  tracabiliteLevel?: number;
  niveauMax?: number;
  valeur?: number;
  actifSecondaire?: string;
}
