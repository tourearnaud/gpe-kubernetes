import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// get user articles
export function useGetUserArticles(user_Id) {
  const URL = endpoints.articles.getAllArticles;
  const { data } = useSWR(URL, fetcher);
  const articles = data;

  const memoizedValue = useMemo(() => {
    const userArticles =
      articles && articles.length > 0
        ? articles.filter((article) => article.userId === user_Id)
        : [];
    return {
      userArticles: userArticles && userArticles.length > 0 ? userArticles : [],
      articles,
    };
  }, [articles, user_Id]);
  
  return memoizedValue;
}

// get all articles
export function useGetAllArticles() {
    const URL = endpoints.articles.getAllArticles;
    const { data } = useSWR(URL, fetcher);
    const articles = data;
  
    const memoizedValue = useMemo(
        () => ({
            articles
        }),
        [articles]
      );
  
    return memoizedValue;
}

// post new article
export async function usePostArticle(articleData) {
  const res = await axios.post(endpoints.articles.addArticle, articleData);
  return res;
}

// post article by id
export function useArtcileById(id) {
  const URL = endpoints.articles.getArticleById(id);
  const { data } = useSWR(URL, fetcher);
  const articles = data;
  
  const memoizedValue = useMemo(
      () => ({
          articles
      }),
      [articles]
    );

  return memoizedValue;
}

export function usePostNewArticleVieProductApi(newArtitcleData) {
  const URL = [endpoints.articles.postProduct, { params: newArtitcleData }];
  const { data } = useSWR(URL, fetcher);

  console.log('test new article', data);
}

// get all articles
export function useGetArticlesWeather() {
  const URL = endpoints.articles.getAllArticles;
  const { data } = useSWR(URL, fetcher);
  const articles = data;
	let weather = [];
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const api_key = 'f00c38e0279b7bc85480c3fe775d518c';
  axios
    .get(url, {
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Origin': 'null',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': '',
        'Access-Control-Expose-Headers': '*',
    },
      params: {
        q: 'paris',
        units: 'metric',
        appid: api_key,
      },
    })
    .then((res) => {
      weather = res.data;
    })
    .catch((error) => {
      console.log(error);
      ;
    });
  const user_Id = 1;
  console.log(weather);
  

  const memoizedValue = useMemo(() => {
    const userArticles =
      articles && articles.length > 0
        ? articles.filter((article) => article.userId === user_Id)
        : [];
    return {
      userArticles: userArticles && userArticles.length > 0 ? userArticles : [],
      articles,
    };
  }, [articles, user_Id]);
  
  return memoizedValue;
}
