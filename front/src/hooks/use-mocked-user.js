import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

// Contexte pour l'utilisateur
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({
    id: '8864c717-587d-472a-929a-8e5f298024da-0',
    username: 'Jaydon Frankie',
    email: 'demo@gpe.cc',
    avatar: `${process.env.REACT_APP_API_URL}/uploads/Profiles/default-avatar.png`,
    role: 'admin',
  });

  // Fonction pour mettre à jour la photo de profil
  const updateAvatar = (newAvatar) => {
    setUser((prev) => ({
      ...prev,
      avatar: `${process.env.REACT_APP_API_URL}/uploads/Profiles/${newAvatar}`,
    }));
  };

  // Fonction pour mettre à jour les autres champs de l'utilisateur
  const updateUser = (updatedFields) => {
    setUser((prev) => ({
      ...prev,
      ...updatedFields,
    }));
  };

  // Utilisation de useMemo pour éviter la recréation de l'objet à chaque re-render
  const value = useMemo(() => ({ user, updateAvatar, updateUser }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook pour consommer le contexte
export const useAuthContext = () => useContext(AuthContext);

// Validation des props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
