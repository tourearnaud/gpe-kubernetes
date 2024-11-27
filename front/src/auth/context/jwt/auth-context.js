import { createContext, useContext } from 'react';

// ----------------------------------------------------------------------
// Création du contexte d'authentification
export const AuthContext = createContext({});

// ----------------------------------------------------------------------
// Définition de la fonction utilitaire `useAuthContext`
export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  return context;
};

// ----------------------------------------------------------------------
// Exemple de composant utilisant le contexte
const SomeComponent = () => {
  const { user } = useAuthContext(); // Utilise le hook défini ci-dessus

  return (
    <img
    src={
      user?.ImageName
        ? `${process.env.REACT_APP_API_URL}/uploads/Profiles/${user.ImageName}`
        : `${process.env.REACT_APP_API_URL}/uploads/Profiles/default-avatar.png`
    }    
      alt="Profile"
    />
  );
};

export default SomeComponent;
