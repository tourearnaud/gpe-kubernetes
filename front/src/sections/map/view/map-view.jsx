import { useState, useCallback, useEffect } from 'react';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import Map from '../map';

// Tableau de constantes représentant les onglets
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

export default function MapView() {
  // Utilisation du contexte pour récupérer les paramètres de l'application
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* Le conteneur principal de la carte */}
      <Card
        sx={{
          mb: 3,        // Marge en bas pour espacer la carte
          height: 600,  // Hauteur de la carte
        }}
      >
        {/* Composant Map intégré dans la carte */}
        <Map />
      </Card>
    </Container>
  );
}
