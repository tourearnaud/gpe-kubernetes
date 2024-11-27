import { useState } from 'react';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import { useAuthContext } from 'src/auth/hooks';
import axios, { endpoints } from 'src/utils/axios';
import ProfileCover from '../profile-cover';

export default function UserProfileView() {
  const { user, updateAvatar } = useAuthContext(); // Ajout de `updateAvatar`
  const [preview, setPreview] = useState(user.avatar || 'assets/default-avatar.png'); // Prévisualisation
  const [photoFile, setPhotoFile] = useState(null); // Fichier sélectionné

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 5) {
        alert('La taille maximale est de 5 Mo.');
        return;
      }
      setPhotoFile(file);
      setPreview(URL.createObjectURL(file)); // Prévisualisation locale
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile) {
      alert('Veuillez sélectionner une photo.');
      return; // Nécessaire ici pour arrêter l'exécution si aucune photo n'est sélectionnée
    }

    const formData = new FormData();
    formData.append('ImageFile', photoFile);

    try {
      const response = await axios.put(endpoints.user.updateUser(user.id), formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const newAvatarUrl = `http://localhost:8090/uploads/Profiles/${response.data.imageName}`;
      updateAvatar(newAvatarUrl); // Met à jour l'avatar dans le contexte
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour de la photo.");
    }
  };

  return (
    <Container>
      <Card>
        <ProfileCover
          name={user.username}
          avatarUrl={preview}
          onAvatarChange={handlePhotoChange}
          onSaveAvatar={handleSavePhoto}
        />
      </Card>
    </Container>
  );
}
