import React, { createContext, useEffect, useState, useRef } from 'react';
import NoSleep from 'nosleep.js';
import Router from 'next/router';
import { useSession } from 'next-auth/react';

interface User {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    photo?: string | null;
  }
}

interface AuthContextData {
  session: any;
  status: string | null;
  loggedUser: User | null;
  newUser: User | null;
}

const AuthContext = createContext<AuthContextData>({
  session: null,
  status: null,
  loggedUser: null,
  newUser: null,
});

export const AuthProvider: React.FC = (props) => {
  const { data: session, status } = useSession();
  const [loggedUser, setLoggedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User | null>(null);
  const noSleep = useRef<NoSleep | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      return () => { };
    }
    if (status === 'unauthenticated') {
      if (noSleep.current) {
        noSleep.current.disable();
      }
      Router.push('/');
      return () => { };
    }
    if (!noSleep.current) {
      noSleep.current = new NoSleep();
    }
    noSleep.current.enable();

    if (session?.user?.email) {
      const setCurrentUser = (data: any) => {
        if (data && data.user) {
          setLoggedUser(data);
        } else {
          setNewUser({
            user: {
              name: session.user?.name,
              email: session.user?.email,
              photo: session.user?.image,
            }
          });
          Router.push('/auth/new-user');
        }
      };

      fetch('/api/get-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `{
            user(email: "${session.user.email}") {
              id,
              name,
              email,
            }
          }`,
        }),
      })
        .then((res) => res.json())
        .then((res) => setCurrentUser(res.data));
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={{ session, loggedUser, newUser, status }} {...props} />
  );
};

export const useAuthProvider = (): AuthContextData => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('You need to wrap AuthProvider.');
  }
  return context;
};
