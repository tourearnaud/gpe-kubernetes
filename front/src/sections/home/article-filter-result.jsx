import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import Iconify from 'src/components/iconify';
import { shortDateLabel } from 'src/components/custom-date-range-picker';

// ----------------------------------------------------------------------

export default function ArticleFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}) {
  // Gestion de la suppression d'un filtre de catégorie
  const handleRemoveCategory = (inputValue) => {
    const newValue = filters.category.filter((item) => item !== inputValue);
    onFilters('category', newValue);
  };

  // Gestion de la suppression d'un filtre de nom
  const handleRemoveName = (inputValue) => {
    const newValue = filters.name.filter((item) => item !== inputValue);
    onFilters('name', newValue);
  };

  return (
    <Stack spacing={1.5} {...other}>
      {/* Affiche le nombre de résultats trouvés */}
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">

        {/* Affiche les filtres de catégorie sous forme de chips */}
        {!!filters.category.length && (
          <Block label="Category:">
            {filters.category.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                onDelete={() => handleRemoveCategory(item)}
              />
            ))}
          </Block>
        )}

        {/* Affiche les filtres de nom d'article sous forme de chips */}
        {!!filters.name.length && (
          <Block label="Article:">
            {filters.name.map((item) => (
              <Chip key={item} label={item} size="small" onDelete={() => handleRemoveName(item)} />
            ))}
          </Block>
        )}

        {/* Bouton pour réinitialiser tous les filtres */}
        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            Clear
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

// Définition des types de props pour le composant ArticleFiltersResult
ArticleFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  onResetFilters: PropTypes.func,
  results: PropTypes.number,
};

// ----------------------------------------------------------------------

// Composant Block pour organiser chaque groupe de filtres
function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      {/* Etiquette du groupe de filtres */}
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      {/* Conteneur pour les enfants (filtres sous forme de chips) */}
      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

// Définition des types de props pour le composant Block
Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
