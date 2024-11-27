// Importations nécessaires de bibliothèques et composants pour construire l'interface
import { useScroll, m } from 'framer-motion';
import * as React from 'react';
import { useCallback, useState, useEffect } from 'react';
import ScrollProgress from 'src/components/scroll-progress';
import { varFade, MotionViewport } from 'src/components/animate';
import { useTheme } from '@mui/material/styles';
import { useAuthContext } from 'src/auth/hooks';
import Box from '@mui/material/Box';
import axios from 'axios';
import Card from '@mui/material/Card';
import {
  Badge,
  Button,
  Container,
  Stack,
  Drawer,
  Typography,
  Tooltip,
  IconButton,
  Divider,
  FormControlLabel,
  Checkbox,
  Slider,
  styled,
} from '@mui/material';
import MuiInput from '@mui/material/Input';
import { useSettingsContext } from 'src/components/settings';
import { useGetAllArticles } from 'src/api/article';
import { useGetAllCategory } from 'src/api/category';
import { useGetAllAge } from 'src/api/age';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import EmptyContent from 'src/components/empty-content/empty-content';
import ArticleList from '../articles-list';
import ArticleWeather from '../article-weather';
import ArticleSearch from '../article-search';
import ArticleFiltersResult from '../article-filter-result';

// Déclaration de valeurs par défaut pour les filtres
const defaultFilter = {
  category: [],
  name: null,
};

// Style pour l'entrée de prix avec une largeur fixe
const Input = styled(MuiInput)`
  width: 42px;
`;

// Fonction principale de la vue HomeView
export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const theme = useTheme();
  const { user } = useAuthContext();
  const settings = useSettingsContext();
  const { articles } = useGetAllArticles();

  // Initialisation des limites de prix (par défaut 0 à 50)
  // const MAX = 250;
  const [MAX, setMax] = useState(50);
  const MIN = 0;
  const [categoryId, setCategoryId] = useState({
    catId: null,
    minPrice: MIN,
    maxPrice: MAX,
    ageId: null,
    Data: articles || [],
  });

  // Utilisation de useEffect pour récupérer la valeur maximale de prix des articles
  useEffect(() => {
    if(articles !== undefined) {
      const prixmax = Math.max(...articles.map(o => o.prix))
      setMax(prixmax);
    }
  }, [articles]);

  const [articlesCat, setArticlesCat] = useState([]);

  const { categoryList } = useGetAllCategory();

  const { ageList } = useGetAllAge();

  const [showArticles, setShowArticles] = useState(false);

  const [color, setColor] = useState(false);

  const openFilter = useBoolean();

  // Initialisation pour les champs de recherche et de filtre
  const [search, setSearch] = useState({
    query: '',
    results: [],
  });
  

  const [filters, setFilters] = useState(defaultFilter);
  const dataFiltered = applyFilter({
    inputData: articles || [],
    filters,
    categoryList,
  });

   // État pour les articles liés à la météo
  const [articlesWeather, setArticlesWeather] = useState({
    temp: null,
    icon: null,
    Data: articles || [],
  });  
	
   // Fonction pour récupérer et filtrer les articles selon la météo actuelle
  const handleWeatherArticles = async (data, data_article) => {
    const weather_data = data.weather[0].main;
    const weather_temp = data.main.temp;
    const weather_temp_cut = weather_temp.toString().slice(0,2);
    const weather_icon = data.weather[0].icon;

    if (weather_data === 'Rain' || weather_data === 'Clouds' || weather_data === 'Snow') {
      const filteredArticlesByWeather = data_article.filter(
        (article) =>
          article.weather === 'tout'
      );
      setArticlesWeather((prevState) => ({
        ...prevState,
        temp: weather_temp_cut,
        icon: weather_icon,
        Data: filteredArticlesByWeather,
      }));
    } else {
      const filteredArticlesByWeather = data_article.filter(
        (article) =>
          article.weather === 'soleil' 
      );
      setArticlesWeather((prevState) => ({
        ...prevState,
        temp: weather_temp_cut,
        icon: weather_icon,
        Data: filteredArticlesByWeather,
      }));
    }
  };
  
   // Utilisation de useEffect pour appeler l'API météo à l'initialisation
  useEffect(() => {
    const url = 'https://api.openweathermap.org/data/2.5/weather';
    const api_key = 'c5b2c8c2181465ce6d9654e12e5ed1c7'; /* f00c38e0279b7bc85480c3fe775d518c && 97ad3615f29c458ca59fd536d8e1d14a && c5b2c8c2181465ce6d9654e12e5ed1c7 */ 
    axios
      .get(url, {
        params: {
          q: 'paris',
          units: 'metric',
          appid: api_key,
        },
      })
      .then((res) => {
        // setWeather(res.data);        
        if (articles !== undefined) {
          handleWeatherArticles(res.data, articles);
        }
      })
      .catch((error) => {
        console.log(error);        
      });      

  }, [articles]);

  // Mise à jour de l'état des catégories d'articles lors de changements de données
  useEffect(() => {
    setArticlesCat(categoryId.Data);
  }, [categoryId.Data]);

   // Filtrage des articles en fonction de la catégorie sélectionnée
  const handleCategoryChange = (newCategoryId) => {
    if (categoryId.ageId == null && categoryId.minPrice === MIN && categoryId.maxPrice === MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    } else if (categoryId.ageId != null && categoryId.minPrice === MIN && categoryId.maxPrice === MAX){
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.ageId === categoryId.ageId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    } else if (categoryId.ageId == null && categoryId.minPrice === MIN && categoryId.maxPrice !== MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
      
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    } else if (categoryId.ageId == null && categoryId.minPrice !== MIN && categoryId.maxPrice === MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    } else if (categoryId.ageId == null && categoryId.minPrice !== MIN && categoryId.maxPrice !== MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    } else {
      const filteredArticles = articles.filter(
        (article) =>
          article.categorieId === newCategoryId && article.ageId === categoryId.ageId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        catId: newCategoryId,
        Data: filteredArticles,
      }));
    }

    // Autres conditions pour les filtres combinés (âges, catégories, prix)
    setShowArticles(true);
    setColor(true);
  };

  const handleAgeChange = (newAgeId) => {
    if (categoryId.catId == null && categoryId.minPrice === MIN && categoryId.maxPrice === MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    } else if (categoryId.catId != null && categoryId.minPrice === MIN && categoryId.maxPrice === MAX){
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.categorieId === categoryId.catId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    } else if (categoryId.catId == null && categoryId.minPrice === MIN && categoryId.maxPrice !== MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
      
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    } else if (categoryId.catId == null && categoryId.minPrice !== MIN && categoryId.maxPrice === MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    } else if (categoryId.catId == null && categoryId.minPrice !== MIN && categoryId.maxPrice !== MAX) {
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    } else {
      const filteredArticles = articles.filter(
        (article) =>
          article.ageId === newAgeId && article.categorieId === categoryId.catId && article.prix >= categoryId.minPrice  && article.prix <= categoryId.maxPrice 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        ageId: newAgeId,
        Data: filteredArticles,
      }));
    }

    setShowArticles(true);
    setColor(true);
  };

   // Gère la modification de l'intervalle de prix dans le filtre
  const handleChangePrice = (event, newValue) => {
    if (categoryId.catId == null && categoryId.ageId == null ) {
      const filteredArticles = articles.filter(
        (article) =>
          article.prix >= newValue[0]  && article.prix <= newValue[1] 
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        minPrice: newValue[0],
        maxPrice: newValue[1],
        Data: filteredArticles,
      }));
    } else if (categoryId.catId != null && categoryId.ageId == null ) {
      const filteredArticles = articles.filter(
        (article) =>
          article.prix >= newValue[0]  && article.prix <= newValue[1] && article.categorieId === categoryId.catId
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        minPrice: newValue[0],
        maxPrice: newValue[1],
        Data: filteredArticles,
      }));
    } else if (categoryId.catId == null && categoryId.ageId != null ) {
      const filteredArticles = articles.filter(
        (article) =>
          article.prix >= newValue[0]  && article.prix <= newValue[1] && article.ageId === categoryId.ageId
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        minPrice: newValue[0],
        maxPrice: newValue[1],
        Data: filteredArticles,
      }));
    } else {
      const filteredArticles = articles.filter(
        (article) =>
          article.prix >= newValue[0]  && article.prix <= newValue[1] && article.ageId === categoryId.ageId && article.categorieId === categoryId.catId
      );
  
      setCategoryId((prevState) => ({
        ...prevState,
        minPrice: newValue[0],
        maxPrice: newValue[1],
        Data: filteredArticles,
      }));
    }
    setShowArticles(true);
  };

  const handleInputChangeMin = (event) => {    
    const filteredArticles = articles.filter(
      (article) =>
        article.prix >= event.target.value  && article.prix <= categoryId.maxPrice 
    );
    setCategoryId((prevState) => ({
      ...prevState,
      minPrice: event.target.value,
      Data: filteredArticles,
    }));
    setShowArticles(true);
  };

  const handleInputChangeMax = (event) => {    
    const filteredArticles = articles.filter(
      (article) =>
        article.prix >= categoryId.minPrice  && article.prix <= event.target.value 
    );
    setCategoryId((prevState) => ({
      ...prevState,
      maxPrice: event.target.value,
      Data: filteredArticles,
    }));
    setShowArticles(true);    
  };

  
  const handleResetCat = () => {
    setCategoryId((prevState) => ({
      ...prevState,
      catId: null,
      minPrice: MIN,
      maxPrice: MAX,
      ageId: null,
      Data: articles || [],
    }));
    
    setArticlesCat([]);
    setShowArticles(false);
    setColor(false);
  };


  const canReset = !!filters.category.length || filters.name;
  const notFound = !dataFiltered.length && canReset;

  const handlefilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterCategory = useCallback(
    (newValue) => {
      const checked = filters.category.includes(newValue)
        ? filters.category.filter((value) => value !== newValue)
        : [...filters.category, newValue];
      handlefilters('category', checked);
    },
    [filters.category, handlefilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilter);
  }, []);

  const handleSearch = useCallback(
    (inputValue) => {
      setSearch((prevState) => ({
        ...prevState,
        query: inputValue,
      }));

      if (inputValue) {
        const results = articles.filter(
          (article) =>
            article.titre.toLowerCase().indexOf(search.query.toLowerCase()) !== -1 ||
            article.contenue.toLowerCase().indexOf(search.query.toLowerCase()) !== -1
        );

        setSearch((prevState) => ({
          ...prevState,
          results,
        }));
      }
    },
    [search.query, articles]
  );

  const renderfilters = (
    <Stack
      spacing={3}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-end', sm: 'center' }}
      direction={{ xs: 'column', sm: 'row' }}
    >
      <ArticleSearch
        query={search.query}
        results={search.results}
        onSearch={handleSearch}
        // hrefItem="/" // render to article details ex {(id) => paths.article.details(id)}
      />
      <Stack direction="row" spacing={1} flexShrink={0}>
        <Button
          disableRipple
          color="inherit"
          endIcon={
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="ic:round-filter-list" />
            </Badge>
          }
          onClick={openFilter.onTrue}
        >
          Filters
        </Button>
        <Drawer
          anchor="right"
          open={openFilter.value}
          onClose={openFilter.onFalse}
          slotProps={{
            backdrop: { invisible: true },
          }}
          PaperProps={{
            sx: { width: 280 },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 2, pr: 1, pl: 2.5 }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Filter
            </Typography>

            <Tooltip title="Reset">
              <IconButton onClick={handleResetCat}>
                <Badge color="error" variant="dot" invisible={!canReset}>
                  <Iconify icon="solar:restart-bold" />
                </Badge>
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ py: 1, px: 4, textAlign: 'center', typography: 'p' }}>            
            <Box component="span" sx={{ color: 'text.primary', typography: 'body2', marginBottom:2}} >
              Catégories
            </Box>  
            {categoryList && (
              <>
                {categoryList.map((categorie) => (
                  <Card
                    key={categorie.id} // Ajoutez la clé ici
                    sx={{ py: 1, px: 4, textAlign: 'center', typography: 'p', boxShadow: `0px 0px 3px 0px ${theme.palette.primary.darker}`, marginBottom:1, cursor:'pointer'}}
                    onClick={() => handleCategoryChange(categorie.id)}
                  >
                    <Box component="span" sx={{ color: categorie.id === categoryId.catId ? 'text.primary' :'text.secondary', typography: 'body2'}}>
                      {`${categorie.contenue}`}
                    </Box>
                  </Card>
                ))}
              </>
            )}
          </Stack>
          <Stack sx={{ py: 1, px: 4, textAlign: 'center', typography: 'p' }}>
            <Box component="span" sx={{ color: 'text.primary', typography: 'body2', marginBottom:2}} >
              Âge 
            </Box>  
            {ageList && (
              <>
                {ageList.map((age) => (
                  <Card
                    key={age.id} // Ajoutez la clé ici
                    sx={{ py: 1, px: 4, textAlign: 'center', typography: 'p', boxShadow: `0px 0px 3px 0px ${theme.palette.primary.darker}`, marginBottom:1, cursor:'pointer'}}
                    onClick={() => handleAgeChange(age.id)}
                  >
                    <Box component="span" sx={{ color: age.id === categoryId.ageId ? 'text.primary' :'text.secondary', typography: 'body2',  }}>
                      {`${age.contenue}`} ans
                    </Box>
                  </Card>
                ))}
              </>
            )}
          </Stack>
          <Stack sx={{ py: 1, px: 4, textAlign: 'center', typography: 'p' }}>
            <Box component="span" sx={{ color: 'text.primary', typography: 'body2', marginBottom:2}} >
              Prix 
            </Box>  
            <Card sx={{ py: 4, px: 2, textAlign: 'center', typography: 'p' }}>            
              <Slider
                min={MIN}
                max={MAX}
                value={[categoryId.minPrice, categoryId.maxPrice]}
                onChange={handleChangePrice}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* <Input
                  value={categoryId.minPrice}
                  size="small"
                  onChange={handleInputChangeMin}
                  inputProps={{
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                />
                <Input
                  value={categoryId.maxPrice}
                  size="small"
                  onChange={handleInputChangeMax}
                  inputProps={{
                    type: 'number',
                    'aria-labelledby': 'input-slider',
                  }}
                /> */}                
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                >
                  {categoryId.minPrice}€
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ cursor: 'pointer' }}
                >
                  {categoryId.maxPrice}€
                </Typography>
              </Box>
            </Card>
          </Stack>
        </Drawer>
      </Stack>
    </Stack>
  );

  const renderResults = (
    <ArticleFiltersResult
      filter={filters}
      onResetFilter={handleResetFilters}
      canReset={canReset}
      onFilters={handlefilters}
      results={dataFiltered.length}
    />
  );

  return (
    <>
      {/* <ScrollProgress scrollYProgress={scrollYProgress} /> */}

      <Container
        component={MotionViewport}
        maxWidth={settings.themeStretch ? false : 'lg'}
        sx={{
          py: { xs: 10, md: 15 },
        }}
      >
        <Stack spacing={2.5} sx={{ mb: { xs: 3, md: 5 } }}>
          {renderfilters}
          {showArticles ? (
            ''
          ) : (
            <ArticleWeather articles={articlesWeather.Data} temp={articlesWeather.temp} icon={articlesWeather.icon} />
          )}

          {canReset && renderResults}
        </Stack>

        {notFound && <EmptyContent title="Aucun article trouvé" filled sx={{ py: 10 }} />}
        {showArticles ? (
        <ArticleList articles={articlesCat} showArticles={showArticles}/>
      ) : (
        <ArticleList articles={articles} showArticles={showArticles}/>
      )}
        
      </Container>
    </>
  );
}

// funcion to apply filter on article list
const applyFilter = ({ inputData, filters, categoryList }) => {
  const { category, name } = filters;

  // FILTER category
  if (category.length) {
    const filterCat = categoryList.filter((cat) => category.includes(cat));
    const catId = filterCat.flatMap((e) => e.id);
    inputData = inputData.filter((c) => catId.includes(c.id));
  }

  // FILTER article title
  if (name) {
    inputData = inputData.filter(
      (article) =>
        article.titre.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        article.contenue.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  return inputData;
};
