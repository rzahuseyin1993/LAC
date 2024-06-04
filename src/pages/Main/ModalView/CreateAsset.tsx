import { useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Stack,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import { ValidatorForm } from 'react-material-ui-form-validator';

import { ApiState } from 'types/ApiState';
import { TextValidator } from 'components/TextValidator';
import { fetchAssetTypes, createAsset, fetchConditions } from 'store/asset';
import { assetSelector } from 'selectors';
import { MainContext } from '../Main';

const CreateAsset = () => {
  const dispatch = useDispatch<any>();
  const { assetTypes, conditions, newLocation, service, status, error } =
    useSelector(assetSelector);
  const { setModalView, setNotification } = useContext(MainContext);
  const [formData, setFormData] = useState<{
    assetName: string;
    assetId: string;
    longitude: number;
    latitude: number;
    assetTypeId: number | null;
    conditionId: number | null;
  }>({
    assetName: '',
    assetId: '',
    longitude: newLocation?.longitude ?? 0,
    latitude: newLocation?.latitude ?? 0,
    assetTypeId: null,
    conditionId: null,
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  useEffect(() => {
    if (isSubmit) {
      if (service === 'createAsset') {
        if (status === ApiState.fulfilled) {
          setIsSubmit(false);
          setModalView(undefined);
          setNotification({
            type: 'success',
            message: 'Created a new asset successfully.',
          });
        } else if (status === ApiState.rejected) {
          setIsSubmit(false);
          setNotification({
            type: 'error',
            message: error?.message ?? 'Failed to submit.',
          });
        }
      }
    }
  }, [service, status]);

  const handleCancelClick = () => {
    setModalView(undefined);
  };

  const handleSubmit = () => {
    setIsSubmit(true);
    const payload = {
      AssetId: formData.assetId,
      Description: formData.assetName,
      Longitude: formData.longitude,
      Latitude: formData.latitude,
      AssetTypeId: formData.assetTypeId ?? 0,
      ConditionId: formData.conditionId ?? 0,
    };
    dispatch(createAsset(payload));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect(() => {
    dispatch(fetchAssetTypes());
    dispatch(fetchConditions());
  }, []);

  return (
    <ValidatorForm onSubmit={handleSubmit}>
      <DialogTitle>Create a new asset</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextValidator
              validators={['required']}
              errorMessages={['This field is required.']}
              name="assetName"
              label="Asset Name"
              value={formData.assetName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              validators={['required', 'isNumber']}
              errorMessages={['This field is required.', 'Muset ba a number']}
              name="assetId"
              label="Asset Id"
              value={formData.assetId}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              validators={['required', 'isFloat']}
              errorMessages={['This field is required.', 'Must ba a float.']}
              name="longitude"
              label="Longitude"
              disabled={true}
              value={formData.longitude}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              validators={['required', 'isFloat']}
              errorMessages={['This field is required.', 'Must ba a float.']}
              name="latitude"
              label="Latitude"
              disabled={true}
              value={formData.latitude}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              select={true}
              validators={['required']}
              errorMessages={['This field is required.']}
              name="assetTypeId"
              label="Asset Type"
              value={formData.assetTypeId ?? ''}
              onChange={handleChange}
            >
              {assetTypes.map(option => (
                <MenuItem key={`asset-type-${option.id}`} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextValidator
              select={true}
              validators={['required']}
              errorMessages={['This field is required.']}
              name="conditionId"
              label="Condition"
              value={formData.conditionId ?? ''}
              onChange={handleChange}
            >
              {conditions.map(option => (
                <MenuItem key={`condition-${option.id}`} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextValidator>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelClick}>Cancel</Button>
        <Stack direction="row" alignItems={'center'} spacing={2}>
          {isSubmit && <CircularProgress size={20} />}
          <Button type="submit" disabled={isSubmit}>
            Create
          </Button>
        </Stack>
      </DialogActions>
    </ValidatorForm>
  );
};

export default CreateAsset;
