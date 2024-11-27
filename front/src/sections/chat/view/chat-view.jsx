import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import {
  Card,
  Box,
  Stack,
  TextField,
  IconButton,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Badge,
} from '@mui/material';
import Iconify from 'src/components/iconify';
import { fetchUsers } from 'src/api/user';
import { useAuthContext } from 'src/auth/hooks';
import { fetcher } from 'src/utils/axios';
import { sendMessage } from 'src/api/chat';

export default function ChatView() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [recipient, setRecipient] = useState(null);
  const [isChatOpen, setChatOpen] = useState(false);
  const [isMinimized, setMinimized] = useState(false);
  const { user } = useAuthContext();
  const hubConnection = useRef(null);
  const messagesEndRef = useRef(null);

  // Gestion de la connexion SignalR
  useEffect(() => {
    if (!user?.username) {
      return () => {};
    }

    const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.REACT_APP_API_URL}/chatHub`,{
        accessTokenFactory: () => localStorage.getItem('token'),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => {
        console.log('SignalR connecté.');
      })
      .catch((err) => {
        console.error('Erreur SignalR:', err);
      });

    connection.on('ReceiveMessage', (receivedMessage) => {
      setMessages((prev) => [...prev, receivedMessage]);

      // Mise à jour des messages non lus
      if (receivedMessage.sender !== user?.username) {
        setUnreadCounts((prev) => ({
          ...prev,
          [receivedMessage.sender]: (prev[receivedMessage.sender] || 0) + 1,
        }));
      }
    });

    hubConnection.current = connection;

    return () => {
      connection.stop().then(() => console.log('SignalR déconnecté.'));
    };
  }, [user?.username]);

  // Chargement des utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await fetchUsers();
        setUsers(response.filter((usr) => usr.username !== user?.username)); // Exclure l'utilisateur connecté
      } catch (error) {
        console.error('Impossible de récupérer la liste des utilisateurs.', error);
      }
    };

    loadUsers();
  }, [user?.username]);

  // Récupération des messages existants pour un utilisateur
  useEffect(() => {
    const fetchMessages = async () => {
      if (!recipient) return;

      try {
        const response = await fetcher(`/api/chat/messages?sender=${user?.username}&recipient=${recipient.username}`);
        setMessages(response || []);

        // Marquer les messages comme lus
        setUnreadCounts((prev) => ({
          ...prev,
          [recipient.username]: 0,
        }));
      } catch (error) {
        console.error('Erreur lors du chargement des messages.', error);
      }
    };

    fetchMessages();
  }, [recipient, user?.username]);

  // Gestion de l'envoi des messages
  const handleSendMessage = async () => {
    if (!recipient) return;

    const newMessage = {
      sender: user?.username,
      recipient: recipient?.username,
      content: message,
      timestamp: new Date().toISOString(),
      read: false,
    };

    try {
      await sendMessage(newMessage);
      setMessages((prev) => [...prev, { ...newMessage, read: true }]);
      setMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message :', error);
    }
  };

  // Scroller automatiquement vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Formater la date et l'heure
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    return isToday
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : `${date.toLocaleDateString([], { month: 'short', day: 'numeric' })} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  // Ne pas afficher le chat si l'utilisateur n'est pas connecté
  if (!user) {
    return null;
  }

  return (
    <>
      {!isChatOpen && (
        <Badge
          badgeContent={Object.values(unreadCounts).reduce((a, b) => a + b, 0)}
          color="error"
          sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
        >
          <IconButton onClick={() => setChatOpen(true)} color="primary">
            <Iconify icon="mdi:chat" />
          </IconButton>
        </Badge>
      )}
      {isChatOpen && (
        <Card
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            width: isMinimized ? 350 : 450,
            height: isMinimized ? 50 : 500,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            boxShadow: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 1,
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <Typography variant="h6">{isMinimized ? 'Chat réduit' : 'Chat'}</Typography>
            <Box>
              {!isMinimized ? (
                <IconButton onClick={() => setMinimized(true)}>
                  <Iconify icon="mdi:minus" />
                </IconButton>
              ) : (
                <IconButton onClick={() => setMinimized(false)}>
                  <Iconify icon="mdi:plus" />
                </IconButton>
              )}
              <IconButton onClick={() => { setChatOpen(false); setMinimized(false); }}>
                <Iconify icon="mdi:close" />
              </IconButton>
            </Box>
          </Box>
          {!isMinimized && (
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              <Box sx={{ width: 150, overflowY: 'auto', borderRight: '1px solid #e0e0e0' }}>
                <List>
                  {users.map((usr) => (
                    <ListItem key={usr.id} button onClick={() => setRecipient(usr)}>
                      <ListItemAvatar>
                        <Avatar>{usr.username?.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={usr.username}
                        secondary={
                          unreadCounts[usr.username] ? `${unreadCounts[usr.username]} non lus` : null
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                  {messages.map((msg, index) => (
                    <Stack
                      key={index}
                      direction={msg.sender === user?.username ? 'row-reverse' : 'row'}
                      spacing={2}
                      sx={{ mb: 2 }}
                    >
                      <Avatar>{msg.sender?.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2">
                          {msg.sender} • {formatDateTime(msg.timestamp)}
                        </Typography>
                        <Typography variant="body1">{msg.content}</Typography>
                        {msg.recipient === user?.username && (
                          <Typography
                            variant="caption"
                            sx={{ color: msg.read ? 'blue' : 'grey' }}
                          >
                            {msg.read ? 'Vu' : ''}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  ))}
                  <div ref={messagesEndRef} />
                </Box>
                <Box sx={{ p: 1, display: 'flex', alignItems: 'center', borderTop: '1px solid #e0e0e0' }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Écrivez un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <IconButton color="primary" onClick={handleSendMessage}>
                    <Iconify icon="mdi:send" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
        </Card>
      )}
    </>
  );
}
