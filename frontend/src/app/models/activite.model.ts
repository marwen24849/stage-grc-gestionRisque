


export interface Activite {
  id: number;
  nom: string;
  description: string;
  responsableId: number;
  responsableNom: string;
  createdAt: string;
  updatedAt: string;
}


export interface ActiviteCreate {
  nom: string;
  description: string;
  responsableId: number;
}