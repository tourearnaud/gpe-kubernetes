import { useEffect, useRef } from 'react';
import { _userFeeds } from 'src/_mock';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import { useArtcileById } from 'src/api/article';
import { useAuthContext } from 'src/auth/hooks';
import Iconify from 'src/components/iconify';
import ProfilePostItem from './profile-post-item';

export default function ProfilePost() {
  const fileRef = useRef(null); // Référence pour l'élément de fichier pour l'upload (non utilisé ici)
  const { user } = useAuthContext(); // Contexte de l'utilisateur
  const { articles } = useArtcileById(JSON.parse(localStorage.getItem('ArticleId'))); // Récupération des articles via l'ID de l'article stocké dans localStorage

  // Fonction pour déclencher l'upload de fichier (actuellement non utilisée dans le composant)
  const handleAttach = () => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  };

  // Gestion des valeurs nulles ou indéfinies pour `user`
  const city = user?.city || 'Non spécifié'; // Utilisation de `?` pour éviter l'erreur
  const email = user?.email || 'Email non disponible';

  // Rendu de la section "A propos" affichant des informations de l'utilisateur
  const renderAbout = (
    <Card>
      <CardHeader title="A propos" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {/* Information personnelle affichée dans le composant */}
        <Box sx={{ typography: 'body2' }}>Ma passion : le golf et voyager</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />
          <Box sx={{ typography: 'body2' }}>
            {`Vie à `}
            <Link variant="subtitle2" color="inherit">
              {city}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          {email}
        </Stack>
      </Stack>
    </Card>
  );

  // Rendu principal du composant
  return (
    <Grid container spacing={3}>
      {/* Section "A propos" */}
      <Grid xs={12} md={4}>
        <Stack spacing={3}>{renderAbout}</Stack>
      </Grid>

      {/* Affichage des articles sous forme de posts */}
      <Grid xs={12} md={8}>
        <Stack spacing={3}>
          {articles && (
            <>
              {articles.map((post) => (
                <ProfilePostItem key={post.id} post={post} />
              ))}
            </>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
