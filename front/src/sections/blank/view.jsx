import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function BlankView() {
  // Récupère les paramètres du contexte des réglages, tels que la configuration du thème
  const settings = useSettingsContext();

  return (
    // Container principal avec une largeur qui dépend des paramètres de thème
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* Titre de la vue */}
      <Typography variant="h4"> Blank </Typography>

      {/* Box représentant une zone vide, stylisée */}
      <Box
        sx={{
          mt: 5, // Marge supérieure
          width: 1, // Prend toute la largeur disponible
          height: 320, // Hauteur fixe de 320 pixels
          borderRadius: 2, // Coins arrondis
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04), // Fond gris clair avec transparence
          border: (theme) => `dashed 1px ${theme.palette.divider}`, // Bordure en pointillés
        }}
      />
    </Container>
  );
}
