import React from 'react';
import NoSleep from 'nosleep.js';
import Router from 'next/router';
import { useSession } from 'next-auth/react';

const AuthContext = React.createContext({
    session: null,
    loggedUser: null,
});

export const AuthProvider = (props) => {
    const { data: session, status } = useSession();
    const [loggedUser, setLoggedUser] = React.useState();
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
            }).then(res => res.json()).then(res => setLoggedUser(res.data));
        }
    }, [session, status]);

    return (
        <AuthContext.Provider value={{ session, loggedUser }} {...props} />
    );
}

export const useAuthProvider = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("You need to wrap AuthProvider.");
    }
    return context;
}