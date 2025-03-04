import { useEffect, useState } from "react";
import { getRecos, getGroupRecos, getProposedRecos } from '../services/recoServices'
import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";
import RecoGridDisplay from "../components/RecoGridDisplay";
import PromptBar from "../components/PromptBar";

const Recos = () => {
    const { user } = UserAuth()
    // recos
    const [recos, setRecos] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    // active tab
    const [activeTab, setActiveTab] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    // prompt bar
    const [prompt, setPrompt] = useState("")

    // load recos
    const loadRecos = async () => {
        if (!user) return;
        // load recos depending on the activeTab
        setIsLoading(true);
        if (activeTab === 0) {
            setRecos(await getRecos(user));
        } else if (activeTab === 1) {
            setRecos(await getGroupRecos(user));
        } else if (activeTab === 2) {
            setRecos(await getProposedRecos(user));
        }
        setIsLoading(false);
    }


    // refresh recos of a specified tab
    const switchToTab = async (tabNum) => {
        // if tab num is the same, avoid retrieving from the database
        if (tabNum == activeTab) return;
        setActiveTab(tabNum);
    }

    // render a bar where users can input prompts into
    const renderPromptBar = () => {
        const maxChars = 300;
        if (isFormOpen) return;

        return (
            <div >
                <div className="prompt-bar">
                    <textarea
                        className="input"
                        type="text"
                        placeholder="Use A.I. to automatically create a new Reco!! Enter prompt here..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        rows={3}
                        maxLength={maxChars}
                    />
                    <div className="char-counter">
                        {prompt.length} / {maxChars}
                    </div>
                    <button className="generate" onClick={() => console.log("GENERATING AI RESPONSE")} disabled={false}>
                        {"Generate"}
                    </button>
                </div>
            </div>)
    }

    // render a tab and its contents when it is active
    const renderActiveTab = () => {
        if (isFormOpen) return;
        if (isLoading) return <p>...</p>;

        return <RecoGridDisplay recos={recos} />;
    };

    // render the reco navbar
    const renderRecoNavbar = () => {
        if (isFormOpen) return;

        return <div className="reco-navbar" >
            <button onClick={() => switchToTab(0)}>Personal</button>
            <button onClick={() => switchToTab(1)}>Group</button>
            <button onClick={() => switchToTab(2)}>Let's do this next!</button>
            <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
        </div>
    };

    useEffect(() => {
        loadRecos()

    }, [user, activeTab, isFormOpen]);

    return (
        <div className="recos">

            {renderRecoNavbar()}

            {renderActiveTab()}

            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={loadRecos} reco={null} prompt={prompt} />

        </div>
    );
}

export default Recos
/* {renderPromptBar()} */