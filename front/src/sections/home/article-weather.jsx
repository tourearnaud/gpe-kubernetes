import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import Image from 'src/components/image';
import Card from '@mui/material/Card';
import { format, formatDistance, formatRelative, subDays } from 'date-fns';
import ArticleItems from './article-items';

// ----------------------------------------------------------------------

export default function ArticleWeather({ articles, temp, icon }) {
  const router = useRouter();

  // Format de la date en français
  const newDate = new Date();
  const date_format = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'long',
    timeZone: 'Europe/Paris',
  }).format(newDate).split('à')[0];
  
  // Limite les articles affichés à 3
  articles = articles.slice(0, 3);

  // Gestion de l'affichage des détails d'un article (route à définir)
  const handleView = useCallback(
    (id) => {
      router.push('/');
    },
    [router]
  );

  // Gestion de l'édition d'un article (route à définir)
  const handleEdit = useCallback(
    (id) => {
      router.push('/');
    },
    [router]
  );

  // Gestion de la suppression d'un article
  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="flex"
        justifyContent="center"
        flexDirection="column"
      > 
        {/* Affichage de l'en-tête météo */}
        <Box>
          <h2>Lieu Meteo à proprier</h2>
        </Box>
        
        {/* Affichage de la carte météo */}
        <Card sx={{ background: 'unset', boxShadow: 'unset', textAlign: 'center' }}>
          <Box>
            {date_format}
          </Box>

          <Box>
            Paris
          </Box>

          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="icon" />

          <Box sx={{ marginBottom: '30px' }}>
            {temp}
            <sup className="deg">°C</sup>
          </Box>

          {/* Affichage des articles dans une grille */}
          <Box
            gap={3}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
            }}
            sx={{ textAlign: 'left' }}
          >        
            {articles && articles.map((article) => (
              <ArticleItems
                key={article.id}
                article={article}
                onView={() => handleView(article.id)}
                onEdit={() => handleEdit(article.id)}
                onDelete={() => handleDelete(article.id)}
              />
            ))}
          </Box>
        </Card>                
      </Box>

      {/* Pagination si le nombre d'articles dépasse 8 */}
      {articles && articles.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

// Définition des types de props pour le composant ArticleWeather
ArticleWeather.propTypes = {
  articles: PropTypes.array,
  temp: PropTypes.string,
  icon: PropTypes.string,
};
