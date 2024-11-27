import React, { useState, useEffect } from 'react'; 
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { RouterLink } from 'src/routes/components';
import { useAuthContext } from 'src/auth/hooks';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Typography from '@mui/material/Typography';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import JwtLoginView from 'src/sections/auth/jwt/jwt-login-view'; // Importation de JwtLoginView

export default function ArticleItems({ onView, onEdit, onDelete, article }) {
  const { user } = useAuthContext(); // Contexte utilisateur
  const popover = usePopover();
  const [openLogin, setOpenLogin] = useState(false); // État pour le pop-up

  // Fonction pour gérer l'ouverture et la fermeture du pop-up
  const handleLoginOpen = () => setOpenLogin(true);
  const handleLoginClose = () => setOpenLogin(false);

  // Fonction pour stocker l'ID de l'article et gérer l'accès
  const handleClickStockIdArticle = async (id, event) => {
    if (!user) {
      event.preventDefault(); // Empêche la redirection
      handleLoginOpen(); // Affiche le pop-up
    } else {
      localStorage.setItem('ArticleId', id); // Stocke l'ID si connecté
    }
  };

  // Surveiller l'état utilisateur et fermer le pop-up s'il est connecté
  useEffect(() => {
    if (user) {
      setOpenLogin(false); // Ferme le pop-up automatiquement
    }
  }, [user]);

  const renderRating = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'warning.lighter',
      }}
    >
      <Iconify icon="eva:star-fill" sx={{ color: 'warning.main', mr: 0.25 }} /> 5
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {renderRating}
        <Image
          alt={article.imageFile}
          src={`${process.env.REACT_APP_API_URL}/resources/${article.imageName}`}
          sx={{ borderRadius: 1, height: 164, width: 1 }}
        />
      </Stack>
    </Stack>
  );

  const renderContenue = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3) }}>
          {`Contenue : ${article.contenue}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 0, 3), opacity: 0.7 }}>
          {`prix : ${article.prix}€`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 0, 3), opacity: 0.7 }}>
          {`Adresse : ${article.adresses}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3), opacity: 0.7 }}>
          {`Code postal : ${article.codepostal}`}
        </Typography>
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary="12/03/2024" // Exemple de date
      secondary={
        <Link
          component={RouterLink}
          value={article.id}
          onClick={(event) => handleClickStockIdArticle(article.id, event)}
          href="/lieu"
          color="inherit"
          sx={{
            fontSize: (theme) => theme.spacing(3),
          }}
        >
          {article.titre}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  return (
    <>
      <Card>
        {renderImages}
        {renderTexts}
        {renderContenue}
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            popover.onClose();
            onDelete();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      {/* Pop-up de connexion avec JwtLoginView */}
      <Dialog open={openLogin} onClose={handleLoginClose} fullWidth maxWidth="xs">
        <DialogTitle>Connectez-vous pour accéder à cet article</DialogTitle>
        <DialogContent>
          <JwtLoginView />
        </DialogContent>
      </Dialog>
    </>
  );
}

ArticleItems.propTypes = {
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  article: PropTypes.object,
};
