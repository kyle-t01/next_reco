import { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco, updateReco, deleteReco } from "../services/recoServices";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"


const RecoForm = ({ isOpen, onClose, onRecoAdded, onRecoUpdated, onRecoDeleted, reco }) => {
    const inputRef = useRef(null)

    // load the google maps api
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries: ["places"]
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
            // resetForm();
            setUpdateMode(false);
        }
        console.log("update mode is: ", updateMode)
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

        const placeDetails = inputRef.current.getPlaces()
        // gives the details that has been autofilled
        console.log(placeDetails)
        const placeInfo = placeDetails[0]
        setGoogleData(placeInfo);
        console.log("The google data name is: ,", placeInfo.name)

        // now set and update any fields in the form
        setTitle(placeInfo.name)
        setAddress(placeInfo.vicinity)

        let urls = [];
        if (placeInfo.photos && placeInfo.photos.length > 0) {
            urls = placeInfo.photos.map(photo => photo.getUrl({ maxWidth: 400 }));
        }
        setImageUrls(urls)

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

            onClose();
        } catch (error) {
            console.log(error)
        }

    }

    const renderDeleteButton = () => {
        if (updateMode) return <button type="delete" className="delete" onClick={handleDelete}>Delete</button>;

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
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

        // TODO: validate entries
        console.log("submitting a new reco", newReco)
        try {
            if (updateMode) {
                console.log("Updating reco:", newReco);
                await updateReco(user, newReco);
                onRecoUpdated()
            } else {
                console.log("Creating new reco:", newReco);
                await createReco(user, newReco);
                onRecoAdded();
            }
            // recoAdded is called wwhen updating or creating

            onClose();
        } catch (error) {
            console.log(error)
        }


    }

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

    }

    if (!isOpen) return null;



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
                        <label>Title</label>
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
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />
                        {/* Description */}
                        <label>Description</label>
                        <input
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
                            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
                            <button type="submit" className="submit" onClick={handleSubmit}>{updateMode ? "Update" : "Add"}</button>
                        </div>
                        {<div className="button-group">
                            {renderDeleteButton()}
                        </div>}
                    </form>
                </div>
                <div className="rightside">
                    <div className="google-description-container">
                        <h4>Google Information</h4>
                        <p>{googleData && googleData.name}</p>
                    </div>
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