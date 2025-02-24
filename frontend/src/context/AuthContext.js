import { useContext, createContext, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signInWithRedirect, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {
    // user states
    const [user, setUser] = useState(null)

    // sign in via google
    const googleSignIn = () => {
        // create instance of the google provider object
        console.log("signing in via google")
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
    }

    // on auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
            console.log("User is:", currentUser)
        })
        return () => {
            unsubscribe()
        }
    }, []);

    // sign out
    const logOut = () => {
        signOut(auth)
        setUser(null)
    }

    return (
        < AuthContext.Provider value={{ user, googleSignIn, logOut }} >
            {children}
        </AuthContext.Provider >
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}