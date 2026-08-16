export interface AssetClassification {
  assetId: string;
  disponibilite: number;
  integrite: number;
  confidentialite: number;
  tracabilite: number;
  niveau?: string;
  valeur?: string;
  updatedAt?: string;
}
