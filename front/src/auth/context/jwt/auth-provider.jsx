import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';
import axios, { endpoints } from 'src/utils/axios';
import { AuthContext } from './auth-context';
import { setSession, isValidToken } from './utils';

// ----------------------------------------------------------------------
/**
 * NOTE:
 * We only build demo at basic level.
 * Customer will need to do some extra handling yourself if you want to extend the logic and other features...
 */
// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'token';

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const token = sessionStorage.getItem(STORAGE_KEY);
  
      if (token && isValidToken(token)) {
        setSession(token);
  
        const response = await axios.get(endpoints.authentication.me);
  
        const user = response.data[0];
  
        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              token,
              avatar: user.imageName
                ? `http://localhost:8090/uploads/Profiles/${user.imageName}`
                : `http://localhost:8090/uploads/Profiles/default-avatar.png`,
            },
          },
        });
      } else {
        dispatch({
          type: 'INITIAL',
          payload: {
            user: null,
          },
        });
      }
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);  

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (username, password) => {
    const data = {
      username,
      password,
    };
  
    try {
      const response = await axios.post(endpoints.authentication.login, data);
      const { token } = response.data;
  
      setSession(token); // Enregistre le token dans sessionStorage
  
      if (token) {
        await initialize(); // Recharge toutes les données utilisateur
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
    }
  }, [initialize]);
  

  // REGISTER
  const register = useCallback(async (email, password, firstName, lastName) => {
    const data = {
      email,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.authentication.register, data);

    const { token, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, token);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          token,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------
    // Mise à jour partielle de l'utilisateur
const updateUser = useCallback((updatedFields) => {
  dispatch({
    type: 'LOGIN', // Réutilisation de l'action LOGIN pour mettre à jour user
    payload: {
      user: {
        ...state.user,
        ...updatedFields, // Mise à jour partielle des champs
      },
    },
  });
}, [state.user]);

const updateAvatar = useCallback((newImageName) => {
  dispatch({
    type: 'LOGIN',
    payload: {
      user: {
        ...state.user,
        ImageName: newImageName,
      },
    },
  });
}, [state.user]);


  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
      updateUser,
      updateAvatar, 

    }),
    [login, logout, register,updateUser,updateAvatar,  state.user, status]
  );
  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
