import * as Yup from 'yup';
import { useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthContext } from 'src/auth/hooks';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axios, { endpoints } from 'src/utils/axios';

export default function UserEditView() {
  const { user, updateUser } = useAuthContext(); // Ajouter updateUser
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    username: Yup.string().required('Le username est requis'),
    password: Yup.string().required('Le mot de passe est requis'),
    email: Yup.string().required('L’email est requis').email('L’email doit être valide'),
    phoneNumber: Yup.string().required('Le téléphone est requis'),
    address: Yup.string().required('L’adresse est requise'),
    country: Yup.string().required('Le pays est requis'),
    city: Yup.string().required('La ville est requise'),
    zipCode: Yup.string().required('Le code postal est requis'),
  });

  const defaultValues = useMemo(
    () => ({
      username: user?.username || '',
      city: user?.city || '',
      email: user?.email || '',
      address: user?.address || '',
      country: user?.country || '',
      zipCode: user?.zipCode || '',
      phoneNumber: user?.phoneNumber || '',
      password: user?.password || '',
    }),
    [user]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = useCallback(
    async (data) => {
      console.log("Données envoyées :", data);
      try {
        const formData = new FormData();
        formData.append('Username', data.username);
        formData.append('Password', data.password);
        formData.append('city', data.city);
        formData.append('email', data.email);
        formData.append('country', data.country);
        formData.append('address', data.address);
        formData.append('zipCode', data.zipCode);
        formData.append('phoneNumber', data.phoneNumber);

        if (data.imageFile) {
          formData.append('ImageFile', data.imageFile);
        }

        const response = await axios.put(endpoints.user.updateUser(user.id), formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log("Réponse complète de l'API :", response);

        if (response.status === 200) {
          updateUser({
            username: data.username,
            email: data.email,
            phoneNumber: data.phoneNumber,
            city: data.city,
            address: data.address,
            country: data.country,
            zipCode: data.zipCode,
            password: data.password,
          });

          enqueueSnackbar("Votre profil a été mis à jour avec succès !", { variant: 'success' });
        } else {
          enqueueSnackbar("Une erreur est survenue lors de la mise à jour du profil.", { variant: 'error' });
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        const genericError = error.response?.data?.message || "Erreur lors de la mise à jour.";
        enqueueSnackbar(genericError, { variant: 'error' });
      }
    },
    [user, enqueueSnackbar, updateUser]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <RHFTextField name="username" label="Nom d'utilisateur" />
          <RHFTextField name="email" label="Email" />
          <RHFTextField name="phoneNumber" label="Téléphone" />
          <RHFTextField name="city" label="Ville" />
          <RHFTextField name="address" label="Adresse" />
          <RHFTextField name="zipCode" label="Code Postal" />
          <RHFTextField name="password" label="Mot de passe" type="password" />
        </Box>

        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Mettre à jour les informations
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
