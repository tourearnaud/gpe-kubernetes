import React, { useEffect, useState } from 'react';
import { _userFeeds } from 'src/_mock'; // Import potentiellement inutilisé
import axios from 'axios';  
import { useGetAllArticles } from 'src/api/article'; // Hook pour récupérer tous les articles
import Mapbox, { Marker } from 'react-map-gl'; // Bibliothèque Mapbox pour l'affichage de la carte
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';

// Configuration de la clé d'accès à Mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZ2NoZTEiLCJhIjoiY2xuMGUyeWdlMG1kaTJrbGt6dDh1azZxNiJ9.vVVIfGRk-zyLyYPyW3wQcA';

export default function Map() {
  // État pour stocker les coordonnées de latitude et longitude
  const [LatLng, setLatLng] = useState([]);
  const { articles } = useGetAllArticles(); // Récupération de tous les articles via un hook personnalisé
  console.log(articles); // Debug pour afficher les articles récupérés

  // Fonction pour récupérer les coordonnées des articles depuis le serveur
  const getLngLat = async () => {
    await axios.get('http://localhost:8090/articles')
      .then((result) => {
        setLatLng(result.data); // Mise à jour de l'état avec les données récupérées
      })
      .catch((error) => {
        setLatLng(null); // En cas d'erreur, on définit LatLng comme null
      });
  };

  // État pour les paramètres de vue de la carte
  const [viewPort, setViewPort] = useState({
    latitude: 48.898289, // Latitude par défaut (Paris)
    longitude: 2.370055, // Longitude par défaut (Paris)
    zoom: 10 // Niveau de zoom initial
  });

  return (
    <Mapbox
      {...viewPort} // Configuration de la vue de la carte
      mapboxAccessToken='pk.eyJ1IjoiZ2NoZTEiLCJhIjoiY2xuMGUyeWdlMG1kaTJrbGt6dDh1azZxNiJ9.vVVIfGRk-zyLyYPyW3wQcA'
      width="100%" // La carte prend toute la largeur du conteneur
      height="100%" // La carte prend toute la hauteur du conteneur
      transitionDuration="200" // Durée de la transition des déplacements de la carte
      mapStyle="mapbox://styles/mapbox/streets-v12" // Style de carte Mapbox
    >
      {/* Boucle pour afficher un marqueur pour chaque article */}
      {articles?.map((a) => (
        <Marker
          key={`${a.latitude}-${a.longitude}`} // Clé unique pour chaque marqueur
          latitude={a.latitude} // Latitude du marqueur
          longitude={a.longitude} // Longitude du marqueur
        />
      ))}
    </Mapbox>
  );
}
