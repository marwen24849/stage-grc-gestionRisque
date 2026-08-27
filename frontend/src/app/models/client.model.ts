
export interface Client {
  id: number;
  nom: string;         
  email: string;
  adresse?: string;
  telephone?: string;
  classificationImageBase64?: string;
  createdAt: string;
  updatedAt: string;
}


export type ClientCreate = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;