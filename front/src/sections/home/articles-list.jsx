import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import ArticleItems from './article-items';

// ----------------------------------------------------------------------

export default function ArticleList({ articles, showArticles }) {
  const router = useRouter();
  const perChunk = 3; // Nombre d'articles par page
  const [chunk, setChunk] = useState([]);
  const [page, setPage] = useState(0);
  const [showArticlesPage, setShowArticlesPage] = useState(showArticles);
  const [count, setCount] = useState(0);
  
  // Gestion du changement de page dans la pagination
  const handleChange = (event, value) => {
    setPage(value - 1);   
  };

  // Gère la réinitialisation de la page et du compteur de pagination
  const handleChangePage = (show, value) => {
    if (show === true && value === 0) {
      value += 1; 
      setCount(value);
      setPage(0);           
    } else if (show === false && value === 1) {
      setCount(0);      
      setPage(0);      
    }
  };
  
  // Utilise useEffect pour diviser les articles en pages (chunks) de 3 articles
  useEffect(() => {
    if (articles !== undefined) {
      const result = articles.reduce((resultArray, item, index) => { 
        const chunkIndex = Math.floor(index / perChunk);
      
        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = []; // Crée un nouveau chunk si nécessaire
        }
      
        resultArray[chunkIndex].push(item);
      
        return resultArray;
      }, []);
    
      setChunk(result); // Met à jour les chunks
    }  
  }, [articles]);

  // Appelle handleChangePage pour gérer le changement de la page active
  handleChangePage(showArticles, count);
  
  // Gestion des actions de vue, d'édition et de suppression des articles
  const handleView = useCallback(
    (id) => {
      router.push('/'); // Route à définir
    },
    [router]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push('/'); // Route à définir
    },
    [router]
  );

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
        <Box>
          <h2>Lieu</h2>
        </Box>
        
        {/* Affiche les articles dans une grille avec pagination */}
        <Box
          gap={3}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          }}
        >
          {chunk && chunk[page]?.map((article) => (
            <ArticleItems
              key={article.id}
              article={article}
              onView={() => handleView(article.id)}
              onEdit={() => handleEdit(article.id)}
              onDelete={() => handleDelete(article.id)}
            />
          ))}
        </Box>
      </Box>

      {/* Affiche la pagination si le nombre d'articles dépasse le nombre par page */}
      {articles && articles.length > perChunk && (
        <Pagination
          count={chunk.length}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
          onChange={handleChange} 
        />
      )}
    </>
  );
}

// Définition des types de props pour le composant ArticleList
ArticleList.propTypes = {
  articles: PropTypes.array,
  showArticles: PropTypes.bool,
};
