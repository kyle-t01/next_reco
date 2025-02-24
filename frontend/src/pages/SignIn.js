import { useEffect } from 'react'
import GoogleButton from 'react-google-button'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'


const SignIn = () => {
    const { googleSignIn, user } = UserAuth()
    const navigate = useNavigate()
    // google sign in
    const handleGoogleSignIn = async () => {
        try {
            console.log("awaiting google sign in...")
            await googleSignIn()
            console.log("google sign in DONE")
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {

        if (user != null) {
            // already signed in 
            console.log("already signed in")
            navigate('/recos')
        }
    }, [user]);

    return (
        <div className='sign-in'>
            <h1>Sign In</h1>
            <GoogleButton onClick={handleGoogleSignIn} />
        </div>
    )
}

export default SignIn