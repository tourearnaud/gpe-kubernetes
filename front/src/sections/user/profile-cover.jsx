// Importation des bibliothèques et composants nécessaires
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { bgGradient } from 'src/theme/css';

// ----------------------------------------------------------------------

// Composant pour afficher la couverture de profil de l'utilisateur
export default function ProfileCover({ name, avatarUrl, role, coverUrl }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // Application du dégradé de fond sur l'image de couverture
        ...bgGradient({
          color: alpha(theme.palette.primary.darker, 0.8),
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          // Positionnement du contenu de profil en bas de l'image de couverture sur écran large
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        {/* Avatar de l'utilisateur */}
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            mx: 'auto',
            width: { xs: 64, md: 128 },
            height: { xs: 64, md: 128 },
            border: `solid 2px ${theme.palette.common.white}`, // Bordure blanche autour de l'avatar
          }}
        >
          {/* Affichage de l'initiale de l'utilisateur si l'image n'est pas disponible */}
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        {/* Informations de profil : nom et rôle de l'utilisateur */}
        <ListItemText
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
          primary={name} // Affichage du nom de l'utilisateur
          secondary={role} // Affichage du rôle de l'utilisateur
          primaryTypographyProps={{
            typography: 'h4',
          }}
          secondaryTypographyProps={{
            mt: 0.5,
            color: 'inherit',
            component: 'span',
            typography: 'body2',
            sx: { opacity: 0.48 },
          }}
        />
      </Stack>
    </Box>
  );
}

// Définition des types attendus pour les propriétés du composant
ProfileCover.propTypes = {
  avatarUrl: PropTypes.string,
  coverUrl: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
};
