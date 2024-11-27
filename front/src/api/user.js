import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher } from 'src/utils/axios';

// Récupérer tous les utilisateurs
export const fetchUsers = async () => {
  try {
    const response = await axios.get('/user'); // L'endpoint correct est '/user' selon votre contrôleur
    return response.data; // Retourne les données des utilisateurs
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    throw error;
  }
};

// Mettre à jour un utilisateur
export const useUpdateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`/user/${userId}`, userData); // L'endpoint correct est '/user/{Id}' selon votre contrôleur
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    throw error;
  }
};

// Récupérer un utilisateur par ID
export function useGetUserById(id) {
  const URL = `/user/${id}`; // L'endpoint correct est '/user/{Id}' selon votre contrôleur
  const { data } = useSWR(URL, fetcher); // Utilisation de SWR pour effectuer un appel GET

  const memoizedValue = useMemo(
    () => ({
      user: data,
    }),
    [data]
  );

  return memoizedValue;
}
