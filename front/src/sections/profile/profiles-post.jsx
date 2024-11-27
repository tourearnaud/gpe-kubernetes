// Importation des modules nécessaires
import axios from 'src/utils/axios';
import { useRef, useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { useGetUserArticles } from 'src/api/article';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import ProfileNewPost from './profile-new-post';
import ProfilePostItem from './profile-post-item';

export default function ProfilePost() {
  const fileRef = useRef(null); // Référence pour attacher un fichier
  const { user } = useAuthContext(); // Utilisateur authentifié

  // Vérifie que `user` existe avant d'appeler `useGetUserArticles`
  const { userArticles } = useGetUserArticles(user ? user.id : null);
  const [commentCount, setCommentCount] = useState(0);

  // Fonction pour récupérer le nombre de commentaires de l'utilisateur
  const fetchCommentCount = useCallback(async () => {
    // Vérifie que `user` et `user.id` existent avant d'effectuer la requête
    if (user && user.id) {
      try {
        const response = await axios.get(`/api/commentaires/user/${user.id}/count`);
        setCommentCount(response.data.count); // Met à jour le nombre de commentaires
      } catch (error) {
        console.error('Erreur lors de la récupération du nombre de commentaires :', error);
      }
    }
  }, [user]);

  // Charger le nombre de commentaires lorsque le composant se monte
  useEffect(() => {
    fetchCommentCount();
  }, [fetchCommentCount]);

  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click(); // Attacher un fichier (non utilisé ici)
    }
  };

  // Affichage du nombre de posts et de commentaires
  const renderCountPost = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>
          {userArticles ? userArticles.length : 0}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Posts
          </Box>
        </Stack>

        <Stack width={1}>
          {commentCount} {/* Affiche le nombre total de commentaires */}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body2' }}>
            Commentaires
          </Box>
        </Stack>
      </Stack>
    </Card>
  );

  // Section "À propos" de l'utilisateur
  const renderAbout = user ? (
    <Card>
      <CardHeader title="A propos" />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>Ma passion le golf et voyager</Box>
        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Vie à `}
            <Link variant="subtitle2" color="inherit">
              {user.city}
            </Link>
          </Box>
        </Stack>
        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {user.email}
        </Stack>
      </Stack>
    </Card>
  ) : null;

  // Champ d'ajout de nouveau post
  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <ProfileNewPost />
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderCountPost} 
          {renderAbout}
        </Stack>
      </Grid>
      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {renderPostInput}
          {userArticles ? (
            userArticles.map((post) => (
              <ProfilePostItem key={post.id} post={post} />
            ))
          ) : (
            <Box>Chargement des articles...</Box>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
