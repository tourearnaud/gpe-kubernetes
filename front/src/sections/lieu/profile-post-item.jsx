import PropTypes from 'prop-types';
import { useRef, useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import axios from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { alpha } from '@mui/material/styles';
import { useRouter } from 'src/routes/hooks'; // Import du hook pour rediriger l'utilisateur

export default function ProfilePostItem({ post }) {
  const { user } = useAuthContext();
  const router = useRouter();
  const commentRef = useRef(null);
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  // Vérification des données utilisateur pour éviter des erreurs
  useEffect(() => {
    if (!user) {
      router.replace('/'); // Redirection vers la page d'accueil en cas de déconnexion
    }
  }, [user, router]);

  // Fonction pour charger les commentaires depuis l'API
  const fetchComments = useCallback(async () => {
    try {
      if (post?.id) {
        const response = await axios.get(`/api/commentaires/article/${post.id}`);
        setComments(response.data);
        setCommentCount(response.data.length);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires :', error);
    }
  }, [post?.id]);

  // Charger les commentaires depuis l'API lors du montage du composant
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Gestion du changement de valeur du champ de commentaire
  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  // Fonction pour ajouter un commentaire
  const handleAddComment = async () => {
    if (!message.trim()) {
      enqueueSnackbar('Veuillez entrer un commentaire !', { variant: 'warning' });
      return;
    }

    const newComment = {
      contenue: message,
      ArticlesId: post?.id,
      username: user?.username || 'Anonyme',
      timestamp: new Date().toISOString(),
    };

    try {
      const addComment = await axios.post(`/api/commentaires`, newComment);
      if (addComment && addComment.status === 200) {
        enqueueSnackbar('Le commentaire a été ajouté !', { variant: 'success' });
        setMessage('');
        setComments((prevComments) => [...prevComments, newComment]); // Met à jour les commentaires localement
        setCommentCount((prevCount) => prevCount + 1); // Met à jour le compte de commentaires
      } else {
        enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
    }
  };

  // Focus sur le champ de commentaire lors du clic sur le bouton de commentaire
  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
    }
  }, []);

  const renderActions = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        p: (theme) => theme.spacing(2, 3, 3, 3),
      }}
    >
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={handleClickComment}>
        <Iconify icon="solar:chat-round-dots-bold" />
      </IconButton>
    </Stack>
  );

  const renderCommentList = (
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
      <Avatar src={user?.avatar || 'assets/default-avatar.png'} alt={user?.username || 'Utilisateur'} />
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
              <Iconify icon="uil:message" color="red" />
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
    <Card>
      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
          fontSize: (theme) => theme.spacing(3),
        }}
      >
        {post?.titre || 'Titre inconnu'}
      </Typography>
      <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0) }}>
        {post?.message || 'Aucun message'}
      </Typography>
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3) }}>
          {`Contenu : ${post?.contenue || 'Non spécifié'}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 0, 3), opacity: 0.7 }}>
          {`Adresse : ${post?.adresses || 'Non spécifiée'}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3), opacity: 0.7 }}>
          {`Code postal : ${post?.codepostal || 'Non spécifié'}`}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          {`${commentCount} Commentaire${commentCount > 1 ? 's' : ''}`}
        </Typography>
      </Box>
      {renderActions}
      {renderCommentList}
      {renderInput}
    </Card>
  );
}

ProfilePostItem.propTypes = {
  post: PropTypes.object,
};
