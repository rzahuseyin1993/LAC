export const API_URL = 'https://lacapi.eztrak.net/api';

const ASSET_TYPE_COLORS = [
  'red',
  'blue',
  'green',
  'orange',
  'cyan',
  'pink',
  'purple',
  'gray',
  'DarkRed',
  'Yellow',
  'Gold',
  'Olive',
  'Lime',
  'SteelBlue',
];

type AssetType = {
  id: string;
  name: string;
};

export const assetTypeRenderer: any = (assetTypes: AssetType[]) => {
  return {
    type: 'unique-value',
    field: 'assetType',
    defaultSymbol: {
      type: 'simple-marker',
      size: 10,
      color: 'black',
      outline: {
        color: 'white',
      },
    },
    uniqueValueInfos: assetTypes.map((assetTypeItem, index) => {
      return {
        value: assetTypeItem.name,
        symbol: {
          type: 'simple-marker',
          size: 10,
          color: ASSET_TYPE_COLORS[index] ?? 'black',
          outline: {
            color: 'white',
          },
        },
      };
    }),
  };
};

export const assetConditionRenderer: any = {
  type: 'unique-value',
  field: 'condition',
  defaultSymbol: {
    type: 'simple-marker',
    size: 10,
    color: '#323232',
    outline: {
      color: 'white',
    },
  },
  uniqueValueInfos: [
    {
      value: 'Good',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: 'green',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Fair',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: 'orange',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Poor',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: 'red',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Out Of Service',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: '#6c757d',
        outline: {
          color: 'white',
        },
      },
    },
  ],
};

export const assetPopupTemplate = {
  title: 'Asset ({id})',
  content: [
    {
      type: 'fields',
      fieldInfos: [
        {
          fieldName: 'id',
          label: 'Id',
        },
        {
          fieldName: 'assetId',
          label: 'Asset Id',
        },
        {
          fieldName: 'description',
          label: 'Description',
        },
        {
          fieldName: 'assetClass',
          label: 'Asset Class',
        },
        {
          fieldName: 'assetType',
          label: 'Asset Type',
        },
        {
          fieldName: 'condition',
          label: 'Condition',
        },
        {
          fieldName: 'poleId',
          label: 'Pole Id',
        },
        {
          fieldName: 'activeStatus',
          label: 'Active Status',
        },
        {
          fieldName: 'formattedStatus',
          label: 'Formatted Status',
        },
      ],
    },
  ],
};
