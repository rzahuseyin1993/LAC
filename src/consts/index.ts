export const API_URL = 'https://lacapi.eztrak.net/api';

export const assetSimpleRenderer: any = {
  type: 'simple', // autocasts as new SimpleRenderer()
  symbol: {
    type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
    size: 10,
    color: 'orange',
    outline: {
      // autocasts as new SimpleLineSymbol()
      width: 0.5,
      color: 'white',
    },
  },
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
      value: 'Excellent',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: '#008000',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Good',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: '#90EE90',
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
        color: '#F0E68C',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Poor',
      label: 'Poor, not hazardous',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: '#FFD700',
        outline: {
          color: 'white',
        },
      },
    },
    {
      value: 'Hazardous',
      symbol: {
        type: 'simple-marker',
        size: 10,
        color: '#FF0000',
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
