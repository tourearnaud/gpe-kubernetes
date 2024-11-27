import PropTypes from 'prop-types';
import { useRef, useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import axios from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export default function ProfilePostItem({ post, onPostDeleted }) {
  const { user } = useAuthContext();
  const commentRef = useRef(null);
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false); // État pour le pop-up de confirmation
  const { enqueueSnackbar } = useSnackbar();

  // Charger les commentaires depuis l'API
  const fetchComments = useCallback(async () => {
    if (!post?.id) {
      console.warn('Article ID manquant. Requête ignorée.');
      return;
    }

    try {
      const response = await axios.get(`/api/commentaires/article/${post.id}`);
      setComments(response.data);
      setCommentCount(response.data.length);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires :', error);
      setComments([]);
      setCommentCount(0);
    }
  }, [post]);

  useEffect(() => {
    if (!post || !post.id) {
      console.warn("Aucun article valide détecté. Vérifiez les données de l'article.");
      return;
    }
    fetchComments();
  }, [fetchComments, post]);

  // Supprimer un article
  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(`/articles/${post.id}`);
      if (response.status === 200) {
        enqueueSnackbar('Article supprimé avec succès.', { variant: 'success' });
        if (onPostDeleted) onPostDeleted(post.id); // Mettre à jour la liste des articles dans le composant parent
        setOpenDialog(false); // Fermer le pop-up après la suppression
      } else {
        enqueueSnackbar('Erreur lors de la suppression.', { variant: 'warning' });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article :', error.response || error);
      enqueueSnackbar(
        error.response?.data?.message || 'Impossible de supprimer cet article.',
        { variant: 'error' }
      );
    }
  };

  // Gérer l'ouverture et la fermeture du pop-up
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  // Ajouter un commentaire
  const handleAddComment = async () => {
    if (!message.trim()) {
      enqueueSnackbar('Veuillez entrer un commentaire !', { variant: 'warning' });
      return;
    }

    const newComment = {
      contenue: message,
      ArticlesId: post.id,
      UserId: user?.id,
      Username: user?.username,
      Timestamp: new Date().toISOString(),
    };

    try {
      const response = await axios.post('/api/commentaires', newComment);
      if (response.status === 200) {
        enqueueSnackbar('Commentaire ajouté avec succès.', { variant: 'success' });
        setMessage(''); // Réinitialiser la zone de texte
        fetchComments(); // Recharger les commentaires
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire :', error);
      enqueueSnackbar('Impossible d\'ajouter le commentaire.', { variant: 'error' });
    }
  };

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const renderHead = (
    <CardHeader
      disableTypography
      avatar={
        <Avatar src={user.avatar} alt={user?.username}>
          {user?.username?.charAt(0).toUpperCase()}
        </Avatar>
      }
      title={
        <Link color="inherit" variant="subtitle1">
          {user?.username}
        </Link>
      }
      subheader={<Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>12/03/2024</Box>}
      action={
        <IconButton onClick={handleOpenDialog}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      }
    />
  );

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
      <IconButton>
        <Iconify icon="solar:chat-round-dots-bold" />
      </IconButton>
    </Stack>
  );

  const renderComments = (
    <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <Box key={index}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {comment.username}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {comment.contenue}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              {new Date(comment.timestamp).toLocaleString()}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Aucun commentaire pour cet article.
        </Typography>
      )}
    </Stack>
  );

  const renderInput = (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(0, 3, 3, 3),
      }}
    >
      <Avatar src={user.avatar} alt={user?.username} />
      <InputBase
        fullWidth
        value={message}
        inputRef={commentRef}
        placeholder="Ajouter un commentaire…"
        onChange={handleChangeMessage}
        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
        endAdornment={
          <InputAdornment position="end" sx={{ mr: 1 }}>
            <IconButton size="small" onClick={handleAddComment}>
              <Iconify icon="uil:message" />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          pl: 1.5,
          height: 40,
          borderRadius: 1,
          border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
        }}
      />
    </Stack>
  );

  return (
    <>
      <Card>
        {renderHead}
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
          {post.titre}
        </Typography>
        <Box sx={{ p: 1 }}>
          <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3) }}>
            {`Contenu : ${post.contenue}`}
          </Typography>
          <Image
            alt={post.imageName}
            src={`${process.env.REACT_APP_API_URL}/resources/${post.imageName}`}
            ratio="16/9"
            sx={{ borderRadius: 1.5 }}
          />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            {`${commentCount} Commentaire${commentCount > 1 ? 's' : ''}`}
          </Typography>
        </Box>
        {renderComments}
        {renderInput}
        {renderActions}
      </Card>

      {/* Boîte de dialogue de confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Voulez-vous vraiment supprimer l&apos;article : <strong>{post.titre}</strong> ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleDeletePost} color="error" autoFocus>
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

ProfilePostItem.propTypes = {
  post: PropTypes.object,
  onPostDeleted: PropTypes.func,
};
