import { useEffect, useState } from "react";
import { getRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";

const Recos = () => {
    const { user } = UserAuth()
    const [personalRecos, setPersonalRecos] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    useEffect(() => {
        const getPersonalRecos = async (user) => {
            const data = await getRecos(user)
            console.log(data)
        }
        getPersonalRecos(user)

    }, []);
    return (
        <div className="recos">
            <h1>This is where you can see all Recos</h1>
            <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={() => { }} />
        </div>
    );
}

export default Recos