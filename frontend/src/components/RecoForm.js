import { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco, updateReco, deleteReco } from "../services/recoServices";
import { fetchAIResponse } from "../services/aiServices";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"
import { GOOGLE_MAPS_LIBRARIES } from "../googlePlaces";
import PromptBox from "./PromptBox";

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
    const [googleData, setGoogleData] = useState(null);
    const [isValidSearch, setIsValidSearch] = useState(null);
    const [userPrompt, setUserPrompt] = useState(prompt || "")

    const maxChars = 300;


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
            setGoogleData(reco.googleData || null);

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
        if (!inputRef) {
            resetForm()
            return;
        }
        const placeDetails = inputRef.current?.getPlaces();

        if (!placeDetails || placeDetails.length === 0) {
            setIsValidSearch(false);
            resetForm()
            return;
        }

        // gives the details that has been autofilled

        const placeInfo = placeDetails[0]
        setGoogleData(placeInfo);
        setTitle(placeInfo.name)
        setAddress(placeInfo.vicinity)

        let urls = [];
        if (placeInfo.photos && placeInfo.photos.length > 0) {
            urls = placeInfo.photos.map(photo => photo.getUrl({ maxWidth: 400 }));
        }
        setImageUrls(urls)
        setIsValidSearch(true);
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
        // extract only the fields we want from the google data object
        const newGoogleData = googleData ? {
            name: googleData.name || "",
            price_level: googleData.price_level || null,
            rating: googleData.rating || null,
            url: googleData.url || "",
            website: googleData.website || "",
            vicinity: googleData.vicinity || "",
            user_ratings_total: googleData.user_ratings_total || 0,
            imageUrls: imageUrls || [],
        } : null;
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
            googleData: newGoogleData
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
                reco = null
                onRecoAdded();
            }


            handleClose();
        } catch (error) {
            console.log(error)
        }


    }

    // handling the submission of AI prompt
    const handleAIResponse = async (data) => {
        console.log("AI data was :", data);
        if (!data) return;
        // TODO: ensure that the current reco is updated

        // format data correctly according to category
        if (data.category === 'create-lookup' || data.category === 'create-manual' || data.category === 'update-mode') {
            // make a new object from the AI data
            let recoAIObject = {
                title: data.title || "",
                subTitle: data.subTitle || "",
                category: data.category || "food",
                address: data.address || "",
                description: data.description || "",
                isPrivate: data.isPrivate || false,
                isProposed: data.isProposed || false,
                googleData: data.googleData || null,
                imageUrls: data.googleData?.imageUrls || []
            };
            // handle case where create-manual
            if (data.category === "create-manual") {
                console.log("[create-manual]")
                // put the user id inside the object

                // call updateReco

                // on reco updated

            }
            // handle case where create-lookup
            if (data.category === "create-lookup") {
                console.log("[create-lookup]")

            }
            // handle case where update-mode
            if (data.category === "update-mode") {
                console.log("[update-mode]")
                // if not in update mode, return
                if (!updateMode) return;


            }

        }

        // Create a new reco object from AI data

        console.log("The AI generated reco AI object was ")
        // based on the category mode, modify the object

    };


    const resetForm = () => {
        setTitle("")
        setSubTitle("")
        setCategory("food")
        setAddress("")
        setDescription("")
        setGoogleData(null)
        setIsPrivate(false)
        setIsProposed(false)
        setImageUrls([])
        setIsValidSearch(false);
        setUserPrompt("")

        // reset input ref
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        inputRef.current = null;
    }

    if (!isOpen) return null;


    const renderGoogleDesc = () => {
        if (!googleData) return <p></p>
        return (
            <div className="google-description-container">
                <h4>Google Information</h4>
                <p>{googleData.name}</p>
                {renderGoogleImage()}
                {renderGoogleReviews()}
                {renderGoogleLinks()}
            </div>
        )
    }
    const renderGoogleReviews = () => {
        if (!googleData) return <p></p>

        const { rating, user_ratings_total, price_level } = googleData;

        const price = price_level ? "$".repeat(price_level) : "N/A";
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        return (
            <div className="reco-reviews">
                <div className="stars">{rating || "N/A"} {"⭐".repeat(fullStars)}{hasHalfStar ? "+" : ""}</div>
                <div className="ratings">({user_ratings_total || "0"} reviews)</div>
                <div className="price">Price: {price}</div>
            </div>
        )
    }

    const renderGoogleImage = () => {
        if (!googleData || !imageUrls) {
            return;
        }
        if (imageUrls.length > 0) {
            return <img src={imageUrls[0]} alt={`Google Image `} className="reco-image" />
        }
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
                    <PromptBox
                        user={user}
                        initialPrompt={userPrompt}
                        reco={reco}
                        onAIResponse={handleAIResponse}
                    />
                </div>
                <div className="rightside">
                    {renderGoogleDesc()}
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