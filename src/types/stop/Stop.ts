export type Stop = {
  Id: number;
  AssetId: number;
  Description: string | null;
  Latitude: number;
  Longitude: number;
  AssetClass: string;
  AssetType: string;
  Condition: string;
  PoleId: string;
  AssetsTypeSubLevels: {
    'Sign Post': string;
    'Sign Mount': string;
    'Sign Hardware': string;
    'Sign Condition': string;
    'Sign Dimension': string;
    'Mount Type': string;
  };
  ActiveStatus: string;
  FormattedStatus: string;
};
