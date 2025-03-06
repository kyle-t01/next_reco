import { useEffect, useState } from "react";
import { getRecos, getGroupRecos, getProposedRecos, getAllRecos, createReco } from '../services/recoServices'
import { fetchPlaceIDFromText } from "../services/googleServices";


import { UserAuth } from '../context/AuthContext'

import RecoForm from "../components/RecoForm";
import RecoGridDisplay from "../components/RecoGridDisplay";
import PromptBox from "../components/PromptBox";
import { fetchAIResponseSubset } from "../services/aiServices";


const Recos = () => {
    const { user } = UserAuth()
    // recos
    const [recos, setRecos] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)

    // active tab
    const [activeTab, setActiveTab] = useState(3)
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
        } else if (activeTab === 3) {
            setRecos(await getAllRecos(user));
        }
        setIsLoading(false);
    }


    // refresh recos of a specified tab
    const switchToTab = async (tabNum) => {
        // if tab num is the same, avoid retrieving from the database
        if (tabNum == activeTab) return;
        setActiveTab(tabNum);
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
            <button onClick={() => switchToTab(3)}>Show All</button>
            <button onClick={() => switchToTab(0)}>Personal</button>
            <button onClick={() => switchToTab(1)}>Group</button>
            <button onClick={() => switchToTab(2)}>Let's do this next!</button>
            <button onClick={() => setIsFormOpen(true)}>+ Add Reco</button>
        </div>
    };

    useEffect(() => {
        loadRecos()

    }, [user, activeTab, isFormOpen]);

    const handleAIResponse = async (data) => {
        console.log("handling AI Response")
        if (!data) return;
        // get the user id
        const currentUID = user.uid;
        const categoryMode = data.categoryMode
        console.log("prompt category was: ", categoryMode)
        // format data correctly according to category
        if (["create-lookup", "create-manual", "update-mode"].includes(categoryMode)) {

            // make a new object from the AI data
            let recoAIObject = {
                title: data.title || "",
                subTitle: data.subTitle || "",
                category: data.category || "food",
                address: data.address || "",
                description: data.description || "",
                isPrivate: data.isPrivate || false,
                isProposed: data.isProposed || false,
                placeID: data.placeID || null,
                _id: data._id || null,
                uid: data.uid || currentUID,
            };

            // console log the returned data
            console.log("AI returned this object: ", recoAIObject);

            // handle case where create-manual
            if (categoryMode === "create-manual") {
                console.log("[create-manual]")
                console.log("Creating new reco (from AI):", recoAIObject);
                const newReco = await createReco(user, recoAIObject);
                console.log("newReco to be added to the recos list: ", newReco)
                setRecos([newReco, ...recos]);
                onRecoAdded();
                //handleClose();

            }
            // handle case where create-lookup
            if (categoryMode === "create-lookup") {
                console.log("[create-lookup]")
                console.log("Creating new reco (from AI)")
                // lookup the location in google api, look at address
                console.log("The address to be looked-up: ", recoAIObject.address)
                const newPlaceID = await fetchPlaceIDFromText(recoAIObject.address)
                console.log(newPlaceID)
                recoAIObject.placeID = newPlaceID;
                const newReco = await createReco(user, recoAIObject);
                console.log("newReco to be added to the recos list: ", newReco)
                setRecos([newReco, ...recos]);
                onRecoAdded();
                //handleClose();


            }
            // handle case where update-mode
            if (categoryMode === "update-mode") {
                console.log("[update-mode]")
                console.log("Updating a reco: (from Ai)", recoAIObject);
                //const data = await updateReco(user, recoAIObject);
                //onRecoUpdated(data)
                //handleClose();


                //TODO: philosophy
                // either openai has direct access to backend (guarenteed new)
                // or we pass in a list of recos to ai to process
            }

        }
        // delete-mode should not be allowed to do anything in reco form!
        if (categoryMode === "delete-mode") {
            console.log("[delete-mode] is invalid within reco form")



        }
        // sort-filter should not be allowed to do anything in reco form!
        if (categoryMode === "sort-filter") {
            console.log("[sort-filter] mode")
            //const data = await fetchAIResponseSubset(user, recos, prompt)


        }


    };


    const onRecoAdded = () => {
        console.log("AI added a new Reco ")


        return;
    }

    const onPromptChanged = (p) => {
        setPrompt(p)
    }

    return (
        <div className="recos">

            {renderRecoNavbar()}
            <PromptBox
                user={user}
                initialPrompt={prompt}
                reco={null}
                onAIResponse={handleAIResponse}
                onPromptChanged={onPromptChanged}
            />
            {renderActiveTab()}

            <RecoForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onRecoAdded={loadRecos} reco={null} prompt={prompt} />

        </div>
    );
}

export default Recos
/* */