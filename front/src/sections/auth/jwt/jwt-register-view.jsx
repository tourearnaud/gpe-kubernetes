import * as React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useRouter, useSearchParams } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import axiosInstance, { endpoints } from 'src/utils/axios'; // Import de axiosInstance et des endpoints de votre API

export default function JwtRegisterView({ openLoginForm }) {
  // Utilise le contexte d'authentification pour accéder à la fonction d'enregistrement
  const { register } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(''); // État pour stocker les messages d'erreur
  const [successMsg, setSuccessMsg] = useState(''); // État pour stocker le message de succès
  const searchParams = useSearchParams(); // Récupère les paramètres de recherche dans l'URL
  const returnTo = searchParams.get('returnTo'); // Récupère un paramètre de redirection, si présent
  const password = useBoolean(); // État pour afficher/masquer le mot de passe

  // Schéma de validation pour le formulaire d'inscription utilisant Yup
  const RegisterSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
    city: Yup.string().required('City is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    country: Yup.string().required('Country is required'),
    address: Yup.string().required('Address is required'),
    zipCode: Yup.number().required('Zip Code is required').positive('Zip Code must be a positive number'),
    phoneNumber: Yup.string().required('Phone Number is required'),
  });

  // Valeurs par défaut pour les champs du formulaire
  const defaultValues = {
    username: '',
    password: '',
    city: '',
    email: '',
    country: '',
    address: '',
    zipCode: '',
    phoneNumber: '',
  };

  // Initialisation du formulaire avec react-hook-form et Yup pour la validation
  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fonction de soumission du formulaire d'inscription
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Envoie les données d'inscription à l'API
      await axiosInstance.post(endpoints.authentication.register, {
        username: data.username,
        password: data.password,
        city: data.city,
        email: data.email,
        country: data.country,
        address: data.address,
        zipCode: parseInt(data.zipCode, 10),
        phoneNumber: data.phoneNumber,
      });

      // Affiche un message de succès et redirige vers la page de connexion après 3 secondes
      setSuccessMsg('Votre compte a été créé avec succès ! Vous allez être redirigé vers la page de connexion.');
      setTimeout(() => {
        router.push('/'); // Redirection vers la page d'accueil ou de connexion
      }, 3000);
    } catch (error) {
      console.error(error);
      reset(); // Réinitialise le formulaire en cas d'erreur
      setErrorMsg(typeof error === 'string' ? error : error.message); // Affiche le message d'erreur
    }
  });

  // Rendu de l'en-tête avec le lien pour revenir au formulaire de connexion
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 1, position: 'relative' }}>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Déjà membre ? </Typography>
        <Link onClick={() => openLoginForm.onTrue()} variant="subtitle2">
          Se connecter
        </Link>
      </Stack>
    </Stack>
  );

  // Rendu du formulaire d'inscription avec les champs de saisie
  const renderForm = (
    <Stack spacing={2.5} mb={5}>
      <RHFTextField name="username" label="Username" />
      <RHFTextField name="password" label="Password" type={password.value ? 'text' : 'password'} />
      <RHFTextField name="city" label="City" />
      <RHFTextField name="email" label="Email" />
      <RHFTextField name="country" label="Country" />
      <RHFTextField name="address" label="Address" />
      <RHFTextField name="zipCode" label="Zip Code" />
      <RHFTextField name="phoneNumber" label="Phone Number" />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Créer un compte
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ m: 3 }}>
          {errorMsg}
        </Alert>
      )}

      {!!successMsg && (
        <Alert severity="success" sx={{ m: 3 }}>
          {successMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}

// Définition des types des props du composant pour assurer une validation lors du développement
JwtRegisterView.propTypes = {
  openLoginForm: PropTypes.func,
};
