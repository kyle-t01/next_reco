import GoogleButton from 'react-google-button'
import { UserAuth } from '../context/AuthContext'
const SignIn = () => {
    const { googleSignIn } = UserAuth()

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



    return (
        <div className='sign-in'>
            <h1>Sign In</h1>
            <GoogleButton onClick={handleGoogleSignIn} />
        </div>
    )
}

export default SignIn