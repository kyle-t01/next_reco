// TODO:
// when swithcing to AI prompt box, disable form and create a temporary editedReco object for the Prompt Box to work with instead of passing in a static Reco

import { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco, updateReco, deleteReco } from "../services/recoServices";
import { fetchGoogleData, fetchPlaceIDFromText } from "../services/googleServices";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"
import { GOOGLE_MAPS_LIBRARIES } from "../googlePlaces";
import PromptBox from "./PromptBox";
import { set } from "mongoose";

const RecoForm = ({ isOpen, onClose, onRecoAdded, onRecoUpdated, onRecoDeleted, reco, prompt }) => {
    const inputRef = useRef(null)

    // load the google maps api
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries: GOOGLE_MAPS_LIBRARIES,
    });


    const { user } = UserAuth();


    // updateMode TRUE->PATCH, FALSE->POST
    const [updateMode, setUpdateMode] = useState(false);

    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState("food");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProposed, setIsProposed] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [placeID, setPlaceID] = useState(null);
    const [isValidSearch, setIsValidSearch] = useState(null);
    const [userPrompt, setUserPrompt] = useState(prompt || "")
    const [googleData, setGoogleData] = useState(null)
    const maxChars = 300;
    // AI loading


    // errorModes
    const [isAIError, setAIError] = useState(false)
    const [errorMessageAI, setErrorMessageAI] = useState(null)


    useEffect(() => {


        if (reco) {
            setTitle(reco.title);
            setSubTitle(reco.subTitle);
            setCategory(reco.category);
            setAddress(reco.address);
            setDescription(reco.description);
            setIsPrivate(reco.isPrivate);
            setIsProposed(reco.isProposed);
            setImageUrls(reco.googleData?.imageUrls || []);
            setPlaceID(reco.placeID || null);
            // if there was a placeID, should load up the google data object
            if (reco && reco.placeID.trim() !== "") {
                loadGoogleData()
            }

            setUpdateMode(true);
        } else {
            resetForm();
            setUpdateMode(false);
        }
        console.log("update mode is: ", updateMode)
        setIsValidSearch(!!reco)
    }, [reco]);

    const renderSearchBar = () => {
        if (!isLoaded) return;

        return <div>
            <StandaloneSearchBox
                onLoad={(ref) => inputRef.current = ref}
                onPlacesChanged={handleOnPlacesChanged}>
                <input
                    type="text"
                    placeholder="Search for a place..."
                />
            </StandaloneSearchBox>
        </div>
    }

    const handleOnPlacesChanged = () => {
        console.log("handling on places changed...")
        if (!inputRef) {
            console.log("there was no input ref")
            resetForm()
            return;
        }
        const placeDetails = inputRef.current?.getPlaces();
        console.log("inputRef.current is.. ", inputRef.current)
        console.log("placeDetails are.. ", placeDetails)
        if (!placeDetails || placeDetails.length === 0) {
            setIsValidSearch(false);
            resetForm()
            return;
        }

        // gives the details that has been autofilled
        const placeInfo = placeDetails[0]
        console.log(placeInfo)
        setPlaceID(placeInfo.place_id);
        setTitle(placeInfo.name)
        setAddress(placeInfo.vicinity)
        setGoogleData(placeInfo)

        let urls = [];
        if (placeInfo.photos && placeInfo.photos.length > 0) {
            urls = placeInfo.photos.map(photo => photo.getUrl({ maxWidth: 400 }));
        }
        setImageUrls(urls)
        setIsValidSearch(true);
    }

    const loadGoogleData = async () => {
        console.log("There was an existing placeID, loading up google data now...")
        const data = await fetchGoogleData(reco.placeID)
        console.log("The google data is", data)
        setGoogleData(data)

        return;
    }


    const handleDelete = async (e) => {
        e.preventDefault()

        const _id = reco?._id
        const newReco = {
            _id,
        };
        console.log("deleting some recos")
        try {
            if (updateMode) {
                console.log("Updating reco:", newReco);
                await deleteReco(user, newReco);
                onRecoDeleted()

            }

            handleClose();
        } catch (error) {
            console.log(error)
        }

    }

    const handleClose = () => {
        resetForm();
        onClose();

    }

    const renderDeleteButton = () => {
        if (updateMode) return <button type="delete" className="delete" onClick={handleDelete}>Delete</button>;

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !address || !isValidSearch) {
            alert("Please enter a valid place with a title and address.");
            return;
        }
        const uid = user.uid;
        const _id = reco?._id
        const newReco = {
            _id,
            title,
            subTitle,
            category,
            address,
            description,
            isPrivate,
            isProposed,
            uid,
            placeID: placeID
        };


        // TODO: validate entries here
        console.log("submitting a new reco", newReco)
        try {
            if (updateMode) {
                console.log("Updating reco:", newReco);
                const data = await updateReco(user, newReco);
                onRecoUpdated(data)
            } else {
                console.log("Creating new reco:", newReco);
                await createReco(user, newReco);
                onRecoAdded();
            }

            handleClose();
        } catch (error) {
            console.log(error)
        }


    }
    // TODO: when ai response is loading, show loading screen
    // handling the submission of AI prompt
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
                await createReco(user, recoAIObject);
                onRecoAdded();
                handleClose();

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
                await createReco(user, recoAIObject);
                onRecoAdded();
                handleClose();


            }
            // handle case where update-mode
            if (categoryMode === "update-mode") {
                console.log("[update-mode]")
                console.log("Updating a reco: (from Ai)", recoAIObject);
                const data = await updateReco(user, recoAIObject);
                onRecoUpdated(data)
                handleClose();

            }

        }
        // delete-mode should not be allowed to do anything in reco form!
        if (categoryMode === "delete-mode") {
            console.log("[delete-mode] is invalid within reco form")
            setAIError(true)
            setErrorMessageAI("ERROR: delete via A.I. is not available within forms")


        }
        // sort-filter should not be allowed to do anything in reco form!
        if (categoryMode === "sort-filter") {
            console.log("[sort-filter] is invalid within reco form")
            setAIError(true)
            setErrorMessageAI("ERROR: sorting and filtering via A.I. are not available within forms")

        }


    };


    const resetForm = () => {
        setTitle("")
        setSubTitle("")
        setCategory("food")
        setAddress("")
        setDescription("")
        setPlaceID(null)
        setIsPrivate(false)
        setIsProposed(false)
        setImageUrls([])
        setIsValidSearch(false);
        setGoogleData(null)
        setUserPrompt("")
        setAIError(false)
        setErrorMessageAI(null)

        // reset input ref
        if (inputRef.current) {

            inputRef.current.value = "";
        }
    }

    if (!isOpen) return null;


    const renderGoogleDesc = () => {
        if (!googleData) return <p></p>
        return (
            <div className="google-description-container">
                <h4>Google Information</h4>
                <p></p>
                <p>{googleData.name}</p>
                {renderEditorialSummary()}
                {renderGoogleImage()}
                {renderGoogleReviews()}
                {renderGoogleLinks()}
            </div>
        )
    }
    const renderEditorialSummary = () => {
        if (!googleData) return null;
        return (
            <div className="editorial">
                <p>"{googleData.editorialSummary}"</p>
            </div>
        )
    }

    const renderGoogleReviews = () => {
        if (!googleData) return <p></p>

        const { rating, userRatingsTotal, priceLevel } = googleData;

        const price = priceLevel ? "$".repeat(priceLevel) : "N/A";
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <div className="reco-reviews">
                <div className="stars">{rating || "N/A"} {"⭐".repeat(fullStars)}{hasHalfStar ? "+" : ""}</div>
                <div className="ratings">({userRatingsTotal || "0"} reviews)</div>
                <div className="price">Price: {price}</div>
            </div>
        )
    }

    const renderGoogleImage = () => {
        if (!googleData) {
            return;
        }
        if (googleData.photoReference) {

            const imageURL = `https://next-reco-app.onrender.com/api/google/image?photoReference=${googleData.photoReference}`;

            return <img src={imageURL} alt="" className="reco-image" />;
        }

    }

    const renderAIError = () => {
        if (!errorMessageAI) return;
        return <div className="error">{errorMessageAI}</div>
    }

    const renderGoogleLinks = () => {
        if (!googleData) return;

        return (

            <div className="reco-back">
                <p>
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleData.vicinity)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📍 {googleData.vicinity}
                    </a>
                </p>
                {
                    googleData.website && <a
                        href={googleData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        🌐 {googleData.title} Website
                    </a>
                }
            </div>
        )
    }


    return (
        <div className="modal-form" >
            <div className="form-header">
                <h3>{updateMode ? "Update Reco" : "Add A New Reco"}</h3>
                <button className="close" onClick={resetForm}>[reset]</button>
            </div>
            <div className="input-container">
                <div className="leftside">
                    <form>
                        {/* Search Bar */}
                        {renderSearchBar()}
                        {/* Title */}
                        <label>Title (required)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        {/* Sub Title */}
                        <label>Sub Title (optional)</label>
                        <input
                            type="text"
                            value={subTitle}

                            onChange={(e) => setSubTitle(e.target.value)}
                        />
                        {/* Address */}
                        <label>Address (required)</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {/* Description */}
                        <label>Description</label>
                        <textarea
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        {/* isPrivate */}
                        <div className="checkboxes">
                            <label>

                                <input
                                    type="checkbox"
                                    checked={isPrivate}
                                    onChange={(e) => setIsPrivate(e.target.checked)}
                                />
                                Private: hide it from the [Group] tab
                            </label>
                            {/* isProposed */}
                            <label>

                                <input
                                    type="checkbox"
                                    checked={isProposed}
                                    onChange={(e) => setIsProposed(e.target.checked)}
                                />
                                Proposed: any group member can view it in the [Let's do this next!] tab
                            </label>
                        </div>

                        {/* buttons */}
                        <div className="button-group">
                            <button type="button" className="cancel" onClick={handleClose}>Cancel</button>
                            <button type="submit" className="submit" onClick={handleSubmit}>{updateMode ? "Update" : "Add"}</button>
                        </div>
                        {<div className="button-group">
                            {renderDeleteButton()}
                        </div>}
                    </form>
                    {/* AI prompt box: TODO: should NOT be passing in outdated reco object instead of what's currently in form*/}

                </div>
                <div className="rightside">
                    {renderGoogleDesc()}
                    {renderAIError()}
                    <PromptBox
                        user={user}
                        initialPrompt={userPrompt}
                        reco={reco}
                        onAIResponse={handleAIResponse}
                    />
                </div>

            </div>

        </div>
    );
}

export default RecoForm;

/*

<label>Category</label>
<input
type="text"
onChange={(e) => setCategory(e.target.value)}
/>

*/