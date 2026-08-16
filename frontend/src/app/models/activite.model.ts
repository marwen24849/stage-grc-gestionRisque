// src/app/models/activite.model.ts

// Correspond à ActiviteResponseDTO (retourné par l'API)
export interface Activite {
  id: number;
  nom: string;
  description: string;
  responsableId: number;
  responsableNom: string;
  createdAt: string;
  updatedAt: string;
}

// Correspond à ActiviteRequestDTO (envoyé à l'API pour create/update)
export interface ActiviteCreate {
  nom: string;
  description: string;
  responsableId: number;
}