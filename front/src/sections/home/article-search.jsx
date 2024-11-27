import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

import { useRouter } from 'src/routes/hooks';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export default function ArticleSearch({ query, results, onSearch }) {
  const router = useRouter();

  // Fonction pour rediriger l'utilisateur vers la page d'un article en stockant l'ID dans localStorage
  const handleClick = (id) => {
    localStorage.setItem("ArticleId", id);    
    router.push('/lieu');
  };

  // Gère la recherche lorsqu'on appuie sur la touche "Entrée"
  const handleKeyUp = (event) => {
    if (query) {
      if (event.key === 'Enter') {
        const selectProduct = results.filter(
          (article) => article.titre === query || article.contenue === query
        )[0];

        handleClick(selectProduct.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.titre}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Rechercher des articles..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, article, { inputValue }) => {
        // Highlight les parties du titre correspondant à la recherche
        const matches = match(article.titre, inputValue);
        const parts = parse(article.titre, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(article.id)} key={article.id}>
            <Avatar
              key={article.id}
              alt={article.titre}
              src={article.imageFile}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            />

            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}

// Définition des types de props pour le composant ArticleSearch
ArticleSearch.propTypes = {
  onSearch: PropTypes.func,
  query: PropTypes.string,
  results: PropTypes.array,
};
