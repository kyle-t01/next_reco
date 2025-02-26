import { useEffect, useState } from "react";
import { getRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";
import RecoGridDisplay from "../components/RecoGridDisplay";

const Recos = () => {
    const { user } = UserAuth()
    const [personalRecos, setPersonalRecos] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        const getPersonalRecos = async (user) => {
            const data = await getRecos(user)
            console.log(data)
            setPersonalRecos(data)
        }
        getPersonalRecos(user)

    }, []);



    return (
        <div className="recos">
            <h1>This is where you can see all Recos</h1>
            <RecoGridDisplay recos={personalRecos} />
            <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={() => { }} />
        </div>
    );
}

export default Recos