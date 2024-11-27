import * as Yup from 'yup';
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
import { useRouter } from 'src/routes/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import Iconify from 'src/components/iconify';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import JwtRegisterView from './jwt-register-view';

// ----------------------------------------------------------------------

export default function JwtLoginView() {
  // Utilisation du contexte d'authentification pour accéder à la fonction de connexion
  const { login } = useAuthContext();
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState(''); // État pour stocker les messages d'erreur de connexion
  const password = useBoolean(); // État pour afficher/masquer le mot de passe
  const loginForm = useBoolean(true); // État pour alterner entre le formulaire de connexion et d'inscription

  // Schéma de validation pour le formulaire de connexion utilisant Yup
  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Le username est requis'),
    password: Yup.string().required('Password est requis'),
  });

  // Valeurs par défaut du formulaire de connexion
  const defaultValues = {
    username: 'test',
    password: 'test',
  };

  // Initialisation du formulaire avec react-hook-form et Yup pour la validation
  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Fonction de soumission du formulaire de connexion
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Appelle la fonction de connexion du contexte d'authentification
      await login?.(data.username, data.password);

      // Redirige vers la page principale après la connexion
      router.push(PATH_AFTER_LOGIN || '/');
    } catch (error) {
      console.error(error);
      reset(); // Réinitialise le formulaire en cas d'erreur
      setErrorMsg(typeof error === 'string' ? error : error.message); // Affiche le message d'erreur
    }
  });

  // Rendu de l'en-tête avec le lien vers le formulaire d'inscription
  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">Pas encore de membre?</Typography>

        <Link onClick={() => loginForm.onFalse()} variant="subtitle2" sx={{ cursor: 'pointer' }}>
          Créer un compte
        </Link>
      </Stack>
    </Stack>
  );

  // Rendu du formulaire de connexion avec les champs de saisie
  const renderForm = (
    <Stack spacing={2.5} mb={5}>
      <RHFTextField name="username" label="Username" />

      <RHFTextField
        name="password"
        label="Mot de passe"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Link
        variant="body2"
        color="inherit"
        underline="always"
        sx={{ alignSelf: 'flex-end', cursor: 'pointer' }}
      >
        Mot de passe oublié?
      </Link>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Se connecter
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {loginForm.value ? (
        <>
          {renderHead}

          {!!errorMsg && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider>
        </>
      ) : (
        <JwtRegisterView openLoginForm={loginForm} />
      )}
    </>
  );
}
