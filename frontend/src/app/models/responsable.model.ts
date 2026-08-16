export interface Responsable {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  clientId: number;
  clientNom?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
}

export type ResponsableCreate = Omit<Responsable, 'id' | 'createdAt' | 'updatedAt' | 'clientNom'>;