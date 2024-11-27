import useSWR from 'swr';
import { useMemo } from 'react';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// Options pour SWR
const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// Récupérer les messages entre deux utilisateurs
export function useGetMessages(sender, recipient) {
  const URL =
    sender && recipient
      ? `${endpoints.chat.get}?sender=${encodeURIComponent(sender)}&recipient=${encodeURIComponent(recipient)}`
      : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  return useMemo(
    () => ({
      messages: data || [],
      messagesLoading: isLoading,
      messagesError: !!error,
      messagesValidating: isValidating,
    }),
    [data, isLoading, error, isValidating]
  );
}

// Envoyer un message
export async function sendMessage(messageData) {
  if (!messageData || !messageData.sender || !messageData.recipient || !messageData.content) {
    console.error('Les données du message sont incomplètes :', messageData);
    throw new Error('Données du message invalides');
  }

  const URL = endpoints.chat.send;

  try {
    const response = await axios.post(URL, messageData);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message :', error.response || error.message);
    throw error;
  }
}
