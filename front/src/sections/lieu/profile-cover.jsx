import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { RouterLink } from 'src/routes/components';
import { useTheme } from '@mui/material/styles';

export default function ProfileCover({ name, avatarUrl, coverUrl, userid }) {
  const theme = useTheme();

  // Fonction pour stocker l'ID de l'utilisateur dans le localStorage lorsqu'on clique sur le lien
  const handleClickStockIdUser = async (id) => {
    localStorage.setItem('UserId', id);
  };

  return (
    <Box
      sx={{
        backgroundImage: `url(${coverUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: 1,
        color: 'common.white',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        sx={{
          left: { md: 24 },
          bottom: { md: 24 },
          zIndex: { md: 10 },
          pt: { xs: 6, md: 0 },
          position: { md: 'absolute' },
        }}
      >
        {/* Lien vers le profil de l'utilisateur avec l'Avatar */}
        <Link
          component={RouterLink}
          value={userid}
          onClick={() => handleClickStockIdUser(userid)}
          href='/user'
        >
          <Avatar
            alt={name}
            src={avatarUrl}
            sx={{
              mx: 'auto',
              width: { xs: 64, md: 128 },
              height: { xs: 64, md: 128 },
              border: `solid 2px ${theme.palette.common.white}`,
            }}
          >
            {name?.charAt(0).toUpperCase()}
          </Avatar>
        </Link>

        {/* Affichage uniquement du nom de l'utilisateur */}
        <Box
          sx={{
            mt: 3,
            ml: { md: 3 },
            textAlign: { xs: 'center', md: 'unset' },
          }}
        >
          <Box
            sx={{
              typography: 'h4',
              color: 'white',
            }}
          >
            {name}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

ProfileCover.propTypes = {
  avatarUrl: PropTypes.string, // URL de l'image de profil
  coverUrl: PropTypes.string,  // URL de l'image de couverture
  name: PropTypes.string,      // Nom de l'utilisateur
  userid: PropTypes.string,    // ID de l'utilisateur
};
