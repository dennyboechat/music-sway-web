import React from 'react';
import NoSleep from 'nosleep.js';
import Router from 'next/router';
import { useSession } from 'next-auth/react';

const AuthContext = React.createContext({
    session: null,
    loggedUser: null,
    newUser: null,
});

export const AuthProvider = (props) => {
    const { data: session, status } = useSession();
    const [loggedUser, setLoggedUser] = React.useState();
    const [newUser, setNewUser] = React.useState();
    const noSleep = React.useRef();

    React.useEffect(() => {
        if (status === 'loading') {
            return null;
        }
        if (status === 'unauthenticated') {
            if (noSleep.current) {
                noSleep.current.disable();
            }
            Router.push('/');
            return null;
        }
        if (!noSleep.current) {
            noSleep.current = new NoSleep();
        }
        noSleep.current.enable();

        if (session.token.email) {

            const setCurrentUser = (data) => {
                if (data && data.user) {
                    setLoggedUser(data);
                } else {
                    setNewUser({
                        name: session.token.name,
                        email: session.token.email,
                        photo: session.token.picture,
                    });
                    Router.push('/auth/new-user');
                }
            };

            fetch('/api/get-user', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    query: `{
                    user(email: "${session.token.email}") {
                        id,
                        name, 
                        email,
                      }
                  }`
                })
            }).then(res => res.json()).then(res => setCurrentUser(res.data));
        }
    }, [session, status]);

    return (
        <AuthContext.Provider value={{ session, loggedUser, newUser }} {...props} />
    );
}

export const useAuthProvider = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("You need to wrap AuthProvider.");
    }
    return context;
}