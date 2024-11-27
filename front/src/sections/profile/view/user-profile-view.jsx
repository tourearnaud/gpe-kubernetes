import { useState, useCallback } from 'react';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import axios, { endpoints } from 'src/utils/axios';

import ProfileCover from '../profile-cover';
import ProfilePost from '../profiles-post';
import UserEditView from './user-edit-view';

const TABS = [
  {
    value: 'post',
    label: 'Mes posts',
    icon: <Iconify icon="twemoji:camera" width={24} />,
  },
  {
    value: 'profile',
    label: 'Modifier le profil',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
];

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { user, updateAvatar, updateUser } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [currentTab, setCurrentTab] = useState('post');

  // Prévisualisation initiale avec l'image du contexte global
  const [preview, setPreview] = useState(user?.avatar || 'http://localhost:8090/uploads/Profiles/default-avatar.png');
  const [photoFile, setPhotoFile] = useState(null); // Fichier sélectionné
  const [isPhotoDialogOpen, setPhotoDialogOpen] = useState(false); // Contrôle du pop-up
  const [isViewingPhoto, setIsViewingPhoto] = useState(true); // Contrôle entre "afficher" et "modifier"
  const [isSubmitting, setSubmitting] = useState(false);

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      const allowedTypes = ['image/jpeg', 'image/png'];

      // Validation
      if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar('Seuls les fichiers JPG et PNG sont autorisés.', { variant: 'error' });
        return;
      }

      if (fileSizeMB > 5) {
        enqueueSnackbar('La taille maximale est de 5 Mo.', { variant: 'error' });
        return;
      }

      setPhotoFile(file);
      setPreview(URL.createObjectURL(file)); // Prévisualisation locale
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile) {
      enqueueSnackbar('Veuillez sélectionner une photo.', { variant: 'error' });
      return;
    }
  
    setSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append('ImageFile', photoFile); // Nom correspondant au backend
      formData.append('Username', user.username);
      formData.append('Password', user.password);
      formData.append('city', user.city || '');
      formData.append('email', user.email || '');
      formData.append('country', user.country || '');
      formData.append('address', user.address || '');
      formData.append('zipCode', user.zipCode || '');
      formData.append('phoneNumber', user.phoneNumber || '');
  
      const response = await axios.put(`/user/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const newAvatarUrl = `http://localhost:8090/uploads/Profiles/${response.data.imageName}`;
      setPreview(newAvatarUrl); // Met à jour l'aperçu localement
      updateUser({ avatar: newAvatarUrl }); // Met à jour l'avatar dans le contexte global

      if (updateAvatar) {
        updateAvatar(response.data.imageName); // Met à jour la photo globalement (si applicable)
      }
  
      // Met à jour le contexte global avec la nouvelle image
      updateUser({ ImageName: response.data.imageName });
  
      enqueueSnackbar(response.data.message, { variant: 'success' });
      setPhotoDialogOpen(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.response?.data?.message || 'Erreur lors de la mise à jour.', {
        variant: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Mon Profil"
        links={[
          { name: 'Accueil', href: '/' },
          { name: user?.username },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* Carte du profil avec un avatar cliquable uniquement */}
      <Card
        sx={{
          mb: 3,
          height: 290,
          position: 'relative',
        }}
      >
        <ProfileCover
          role={user?.role === 0 ? 'User' : 'Admin'}
          name={user?.username}
          avatarUrl={user?.avatar || 'http://localhost:8090/uploads/Profiles/default-avatar.png'}
          coverUrl="assets/cover.jpg"
          onAvatarClick={() => {
            setIsViewingPhoto(true);
            setPhotoDialogOpen(true);
          }}
        />

        {/* Onglets pour naviguer entre les posts et la modification */}
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {/* Affichage conditionnel basé sur l'onglet actif */}
      {currentTab === 'post' && <ProfilePost />}
      {currentTab === 'profile' && <UserEditView />}

      {/* Pop-up pour afficher ou modifier la photo */}
      <Dialog open={isPhotoDialogOpen} onClose={() => setPhotoDialogOpen(false)} fullWidth maxWidth="xs">
        {isViewingPhoto ? (
          <>
            <DialogTitle>Photo de profil</DialogTitle>
            <DialogContent>
              <img
                src={preview}
                alt={`${user?.username}`}
                style={{ width: '100%', height: 'auto', marginTop: '16px' }}
              />
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton
                  onClick={() => setIsViewingPhoto(false)}
                  variant="contained"
                >
                  Modifier la photo
                </LoadingButton>
              </Stack>
            </DialogContent>
          </>
        ) : (
          <>
            <DialogTitle>Modifier la photo de profil</DialogTitle>
            <DialogContent>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handlePhotoChange}
                style={{ marginTop: '16px' }}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Prévisualisation"
                  style={{ width: '100%', height: 'auto', marginTop: '16px' }}
                />
              )}
              <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                <LoadingButton onClick={handleSavePhoto} variant="contained" loading={isSubmitting}>
                  Enregistrer
                </LoadingButton>
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Container>
  );
}
