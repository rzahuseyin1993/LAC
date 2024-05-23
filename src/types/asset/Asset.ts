export type Asset = {
  id: number;
  assetId: number;
  description: string;
  latitude: number;
  longitude: number;
  assetClass: string;
  assetType: string;
  condition: string;
  poleId: string;
  assetsTypeSubLevels: {
    'Sign Post': string;
    'Sign Mount': string;
    'Sign Hardware': string;
    'Sign Condition': string;
    'Sign Dimension': string;
    'Mount Type': string;
  };
  assetsAssociationTypeSubLevels: {
    id: number;
    asset: {
      id: number;
      name: string;
    };
    assetType: {
      id: number;
      name: string;
    };
    assetTypeLevel1: {
      id: number;
      name: string;
    };
    assetTypeLevel2: {
      id: number;
      name: string;
    };
  }[];
  activeStatus: string;
  formattedStatus: string;
};
