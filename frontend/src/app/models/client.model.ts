// src/app/models/client.model.ts
export interface Client {
  id: number;
  nom: string;         // correspond au champ "nom" du DTO ClientResponseDTO
  email: string;
  adresse?: string;
  telephone?: string;
  createdAt: string;
  updatedAt: string;
}

// Pour la création, on envoie un objet sans id
export type ClientCreate = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;