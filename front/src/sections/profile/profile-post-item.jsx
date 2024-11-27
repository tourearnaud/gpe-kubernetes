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
  const { enqueueSnackbar } = useSnackbar();


  // Fonction pour charger les commentaires depuis l'API
  const fetchComments = useCallback(async () => {
    if (!post?.id) {
      console.warn("Article ID manquant. Requête ignorée.");
      return;
    }
  
    try {
      const response = await axios.get(`/api/commentaires/article/${post.id}`);
      setComments(response.data); // Même si la liste est vide, elle sera gérée
      setCommentCount(response.data.length);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires :", error);
      setComments([]); // Réinitialiser les commentaires
      setCommentCount(0); // Mettre le compteur à zéro
    }
  }, [post]);
  
  

  // Charger les commentaires depuis l'API au montage du composant
  useEffect(() => {
    if (!post || !post.id) {
      console.warn("Aucun article valide détecté. Vérifiez les données de l'article.");
      return;
    }
  
    fetchComments();
  }, [fetchComments, post]);
  
  // Fonction pour gérer la suppression d'un article
  const handleDeletePost = async () => {
    try {
      const response = await axios.delete(`/api/articles/${post.id}`);
      console.log('Delete response:', response);
      if (response.status === 200) {
        enqueueSnackbar('Article supprimé avec succès.', { variant: 'success' });
        console.log('Article deleted successfully. Notifying parent...');
        if (onPostDeleted) onPostDeleted(post.id);
      } else {
        console.warn('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'article :', error);
      enqueueSnackbar('Impossible de supprimer cet article.', { variant: 'error' });
    }
  };

  // Gestion de la modification du contenu du commentaire
  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
    console.log('Message updated:', event.target.value);
  }, []);

  // Fonction pour ajouter un commentaire
  const handleAddComment = async () => {
    if (!message.trim()) {
      enqueueSnackbar('Veuillez entrer un commentaire !', { variant: 'warning' });
      console.warn('Empty comment submitted.');
      return;
    }

    const newComment = {
      contenue: message,
      ArticlesId: post.id,
      UserId: user?.id,
      Username: user?.username,
      Timestamp: new Date().toISOString(),
    };

    console.log('Adding new comment:', newComment);

    try {
      const addComment = await axios.post(`/api/commentaires`, newComment);
      console.log('Add comment response:', addComment);
      if (addComment && addComment.status === 200) {
        enqueueSnackbar('Le commentaire a été ajouté !', { variant: 'success' });
        setMessage('');
        fetchComments();
      } else {
        console.warn('Unexpected response status while adding comment:', addComment.status);
        enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
    }
  };

  // Fonction pour mettre le focus sur le champ de commentaire
  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus();
      console.log('Comment input focused.');
    }
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
        <IconButton onClick={handleDeletePost}>
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
      {renderHead}
      <Typography
        variant="body2"
        sx={{
          p: (theme) => theme.spacing(3, 3, 2, 3),
          fontSize: (theme) => theme.spacing(3),
        }}
      >
        {post.titre}
      </Typography>
      <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0) }}>
        {post.message}
      </Typography>
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3) }}>
          {`Contenu : ${post.contenue}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 0, 3), opacity: 0.7 }}>
          {`Adresse : ${post.adresses}`}
        </Typography>
        <Typography variant="body2" sx={{ p: (theme) => theme.spacing(0, 3, 2, 3), opacity: 0.7 }}>
          {`Code postal : ${post.codepostal}`}
        </Typography>
        <Image
          alt={post.imageName}
          src={`http://localhost:8090/resources/${post.imageName}`}
          ratio="16/9"
          sx={{ borderRadius: 1.5 }}
        />
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
  onPostDeleted: PropTypes.func,
};
