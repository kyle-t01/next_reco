import { useState, useEffect, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco } from "../services/recoServices";
import { useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"


const RecoForm = ({ isOpen, onClose, onRecoAdded, reco }) => {
    const inputRef = useRef(null)

    // load the google maps api
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries: ["places"]
    });


    const { user } = UserAuth();
    const [title, setTitle] = useState(reco?.title || "");
    const [subTitle, setSubTitle] = useState(reco?.subTitle || "");
    const [category, setCategory] = useState(reco?.category || "food");
    const [address, setAddress] = useState(reco?.address || "");
    const [description, setDescription] = useState(reco?.description || "");
    const [isPrivate, setIsPrivate] = useState(reco?.isPrivate || false);
    const [isProposed, setIsProposed] = useState(reco?.isProposed || false);
    const [imageUrls, setImageUrls] = useState(reco?.googleData?.imageUrls || []);
    const [googleData, setGoogleData] = useState(reco?.googleData || null);

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
        }
    }, [reco]);

    const renderSearchBar = () => {
        if (!isLoaded) return;

        return <div>
            <StandaloneSearchBox
                onLoad={(ref) => inputRef.current = ref}
                onPlacesChanged={handleOnPlacesChanged}
            >
                <input
                    type="text"
                    placehoder="Search for a place..."



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

    const handleSubmit = async (e) => {
        e.preventDefault()
        const uid = user.uid;
        const newGoogleData = {
            ...googleData,
            imageUrls: imageUrls


        };
        const newReco = {
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
            const response = await createReco(user, newReco)
            if (response) {
                onRecoAdded();
                onClose();
            }
        } catch (error) {

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
                <h3>Add a New Reco</h3>
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
                            <button type="submit" className="submit" onClick={handleSubmit}>Add Reco</button>
                        </div>

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