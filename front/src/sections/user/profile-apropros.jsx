// Importation des bibliothèques et composants nécessaires
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Iconify from 'src/components/iconify';

// Composant pour afficher la section "À propos" du profil utilisateur
export default function ProfileAPropos({ user }) {
  return (
    <Card>
      {/* En-tête de la carte avec le titre "À propos" */}
      <CardHeader title="A propos" />

      {/* Contenu de la section à propos */}
      <Stack spacing={2} sx={{ p: 3 }}>
        
        {/* Description des centres d'intérêt */}
        <Box sx={{ typography: 'body2' }}>Ma passion le golf et voyager</Box>

        {/* Affichage de la ville de résidence de l'utilisateur */}
        <Stack direction="row" spacing={2}>
          {/* Icône de localisation */}
          <Iconify icon="mingcute:location-fill" width={24} />

          {/* Ville où réside l'utilisateur */}
          <Box sx={{ typography: 'body2' }}>
            {`Vie à `}
            <Link variant="subtitle2" color="inherit">
              {user.city}
            </Link>
          </Box>
        </Stack>

        {/* Adresse e-mail de l'utilisateur */}
        <Stack direction="row" sx={{ typography: 'body2' }}>
          {/* Icône de messagerie */}
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {user.email}
        </Stack>
      </Stack>
    </Card>
  );
}

// Définition des types attendus pour les propriétés du composant
ProfileAPropos.propTypes = {
  user: PropTypes.object,
};
