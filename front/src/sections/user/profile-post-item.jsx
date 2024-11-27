import PropTypes from 'prop-types';
import { useRef, useState, useCallback, useEffect } from 'react';

// Importation des composants Material UI pour la création d'une carte d'éléments de post
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

// Importation de composants personnalisés et de bibliothèques utilitaires
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import axios, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';

export default function ProfilePostItem({ post }) {
  const { user } = useAuthContext();
  const commentRef = useRef(null);
  const [message, setMessage] = useState(''); // Message de commentaire en cours
  const [comments, setComments] = useState([]); // Liste des commentaires pour le post
  const { enqueueSnackbar } = useSnackbar(); // Hook pour les notifications

  // Chargement des commentaires lors du montage du composant
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/commentaire`);
        setComments(response.data); // Mise à jour de la liste des commentaires
      } catch (error) {
        console.error('Erreur lors du chargement des commentaires :', error);
      }
    };

    fetchComments();
  }, [post.id]);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value); // Mise à jour du texte de commentaire
  }, []);

  // Fonction pour ajouter un commentaire
  const handleAddComment = async () => {
    if (!message.trim()) {
      enqueueSnackbar('Veuillez entrer un commentaire !', { variant: 'warning' });
      return;
    }
  
    const newComment = {
      contenue: message,
      ArticlesId: post.id,
      // Ajout d'informations utilisateur au commentaire
      username: user?.username,
      userAvatar: user?.avatar,
    };
  
    try {
      const addComment = await axios.post(endpoints.commentaire.addComment, newComment);
      if (addComment && addComment.status === 200) {
        enqueueSnackbar('Le commentaire a été ajouté !', { variant: 'success' });
        setMessage('');
        setComments((prevComments) => [...prevComments, newComment]); // Ajout du nouveau commentaire dans la liste
      } else {
        enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du commentaire :", error);
      enqueueSnackbar("Impossible d'ajouter un commentaire !", { variant: 'error' });
    }
  };

  const handleClickComment = useCallback(() => {
    if (commentRef.current) {
      commentRef.current.focus(); // Mise en focus de l'input de commentaire
    }
  }, []);

  // Affichage de l'en-tête de la carte de post
  const renderHead = (
    <CardHeader
      disableTypography
      avatar={
        <Avatar src={user.avatar} alt={user?.username}>
          {user?.username?.charAt(0).toUpperCase()} {/* Initiale du nom si l'image n'est pas présente */}
        </Avatar>
      }
      title={
        <Link color="inherit" variant="subtitle1">
          {user?.username} {/* Nom de l'utilisateur */}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>12/03/2024</Box>
      }
      action={
        <IconButton>
          <Iconify icon="eva:more-vertical-fill" /> {/* Bouton d'options supplémentaires */}
        </IconButton>
      }
    />
  );

  // Affichage des actions de la carte
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
        <Iconify icon="solar:chat-round-dots-bold" /> {/* Icône pour commenter */}
      </IconButton>
    </Stack>
  );

  // Affichage de la liste des commentaires
  const renderCommentList = (
    <Stack spacing={1.5} sx={{ px: 3, pb: 2 }}>
      {comments.filter(comment => comment.articlesId === post.id).map((comment, index) => (
        <Box key={index}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {comment.contenue} {/* Contenu du commentaire */}
          </Typography>
        </Box>
      ))}
    </Stack>
  );

  // Champ d'entrée pour ajouter un commentaire
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
          {`Adresse : ${post.adresses} `}
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
      </Box>
      {renderActions}
      {renderCommentList}
      {renderInput}
    </Card>
  );
}

// Validation des types pour les propriétés attendues
ProfilePostItem.propTypes = {
  post: PropTypes.object,
};
