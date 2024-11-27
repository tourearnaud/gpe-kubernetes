import * as Yup from 'yup';
import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Button,
  DialogActions,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetAllCategory } from 'src/api/category';
import { useGetAllAge } from 'src/api/age';
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';
import { Upload } from 'src/components/upload';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function ProfileNewPost() {
  const openNewPost = useBoolean(); // Contrôle d'ouverture de la boîte de dialogue
  const { user } = useAuthContext(); // Accès au contexte utilisateur
  const { categoryList } = useGetAllCategory(); // Récupération des catégories
  const weather = ['soleil', 'tout']; // Options de météo
  const { ageList } = useGetAllAge(); // Récupération des tranches d'âge
  const [file, setFile] = useState(null); // Fichier uploadé
  const { enqueueSnackbar } = useSnackbar(); // Notifications

  const handleDropFile = useCallback((acceptedFiles) => {
    const newFile = acceptedFiles[0];
    setFile(newFile);
  }, []);

  // Valeurs par défaut
  const defaultValues = {
    titre: '',
    contenue: '',
    codepostal: 0,
    adresses: '',
    longitude: '0',
    latitude: '0',
    prix: 0,
    UserId: user ? user.id : null,
    CategorieId: null,
    weather: null,
    AgeId: null,
    ImageName: file,
    ImageFile: file,
  };

  const validationSchema = Yup.object().shape({
    titre: Yup.string().required('Le titre est requis').max(30, 'Maximum 30 caractères'),
    contenue: Yup.string()
      .required('Le contenu est requis')
      .max(255, 'Maximum 255 caractères'),
    adresses: Yup.string().required("L'adresse est requise"),
    codepostal: Yup.number().required('Le code postal est requis'),
    longitude: Yup.string().required('La longitude est requise'),
    latitude: Yup.string().required('La latitude est requise'),
    prix: Yup.number().required('Le prix est requis'),
    weather: Yup.string().required('La météo est requise'),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data) => {
      if (!user) return;
  
      try {
        const adresse_plus = data.adresses.replaceAll(' ', '+');
        const gouvApiResponse = await axios.get(
          `https://api-adresse.data.gouv.fr/search/?q=${adresse_plus}&postcode=${data.codepostal}`
        );
  
        const features = gouvApiResponse.data.features || [];
        if (features.length === 0) {
          enqueueSnackbar("Adresse introuvable, veuillez vérifier.", { variant: 'error' });
          return;
        }
  
        // Convertir les coordonnées en chaînes
        const lat = features[0]?.geometry?.coordinates[1]?.toString() || '0';
        const long = features[0]?.geometry?.coordinates[0]?.toString() || '0';
  
        if (!data.weather) {
          enqueueSnackbar("Le champ météo est requis.", { variant: 'error' });
          return;
        }
        
        const categorie = categoryList.find((cat) => cat.contenue === data.CategorieId);
        const age = ageList.find((a) => a.contenue === data.AgeId);
  
        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('contenue', data.contenue);
        formData.append('codepostal', data.codepostal);
        formData.append('adresses', data.adresses);
        formData.append('longitude', long); // Convertir en chaîne
        formData.append('latitude', lat); // Convertir en chaîne
        formData.append('prix', data.prix);
        formData.append('UserId', user.id);
        formData.append('CategorieId', categorie?.id || null);
        formData.append('AgeId', age?.id || null);
        formData.append('weather', data.weather); // Assurez-vous que ce champ n'est pas vide
        formData.append('ImageName', file ? file.name : '');
        formData.append('ImageFile', file);
        console.log(data);
        console.log([...formData.entries()]); // Vérifier toutes les données envoyées
  
        const response = await axiosInstance.post(endpoints.articles.postProduct, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (response?.data?.message === 'Added successfully') {
          enqueueSnackbar('Publié avec succès !', { variant: 'success' });
          window.location.reload();
        } else {
          enqueueSnackbar("L'article n'a pas été publié !", { variant: 'error' });
        }
      } catch (error) {
        console.error(error.response?.data);
        enqueueSnackbar('Une erreur est survenue.', { variant: 'error' });
      }
    },
    [file, user, categoryList, ageList, enqueueSnackbar]
  );
  

  return (
    <>
      <Button onClick={openNewPost.onTrue} variant="contained" sx={{ mr: 1 }}>
        Publier un article
      </Button>
      <Dialog fullWidth maxWidth="xs" open={openNewPost.value} onClose={openNewPost.onFalse}>
        <DialogTitle>Publier un article</DialogTitle>
        <DialogContent sx={{ overflow: 'unset' }}>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <RHFTextField name="titre" label="Titre" placeholder="Ajouter un titre" />
              <RHFTextField
                name="contenue"
                label="Contenu"
                placeholder="Description de l'endroit"
                multiline
              />
              <RHFTextField name="adresses" label="Adresse" placeholder="40 rue pasteur 57390 Russange" />
              <RHFTextField name="codepostal" label="Code postal" type="number" />
              <RHFTextField name="prix" label="Prix" type="number" placeholder="Prix de l'article" />

              {categoryList && (
                <RHFAutocomplete
                  name="CategorieId"
                  label="Catégories"
                  placeholder="Sélectionnez une catégorie"
                  options={categoryList.map((option) => option.contenue)}
                />
              )}
              {weather && (
                <RHFAutocomplete
                  name="weather"
                  label="Météo"
                  placeholder="Sélectionnez une météo favorable"
                  options={weather}
                />
              )}
              {ageList && (
                <RHFAutocomplete
                  name="AgeId"
                  label="Âge"
                  placeholder="Sélectionnez un âge"
                  options={ageList.map((option) => option.contenue)}
                />
              )}
              <Upload file={file} onDrop={handleDropFile} onDelete={() => setFile(null)} />
            </Stack>
            <Stack mt={5} mb={5}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Publier
              </LoadingButton>
            </Stack>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}
