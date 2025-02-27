import { useState, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco } from "../services/recoServices";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"



const RecoForm = ({ isOpen, onClose, onRecoAdded }) => {
    const inputRef = useRef(null)

    // load the google maps api
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries: ["places"]
    });


    const { user } = UserAuth();
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [category, setCategory] = useState("food");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [googleDescription, setGoogleDescription] = useState("")
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProposed, setIsProposed] = useState(false);
    const [googleImageUrl, setGoogleImageUrl] = useState("");

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
        const placeInfo = placeDetails[0]

        // now set and update any fields in the form
        setTitle(placeInfo.name)
        setAddress(placeInfo.formatted_address)

        // generate a google description string
        const website = placeInfo.website || "Website not available";
        const googleMapsUrl = placeInfo.url || "Google Maps link not available";
        const googleDescString = `📍${googleMapsUrl}\n🌐 ${website}`
        setGoogleDescription(googleDescString);

        // extracting the imageURL (google) 
        let imageUrl = "";
        const maxWidth = 400;
        if (placeInfo.photos && placeInfo.photos.length > 0) {
            imageUrl = placeInfo.photos[0].getUrl({ maxWidth: maxWidth });
        }
        setGoogleImageUrl(imageUrl)

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const uid = user.uid;
        const newReco = { title, subTitle, category, address, googleDescription, description, isPrivate, isProposed, uid, googleImageUrl }
        // TODO: validate entries
        console.log("submitting a new reco")
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
        setGoogleDescription("")
        setDescription("")
        setIsPrivate(false)
        setIsProposed(false)
        setGoogleImageUrl("")

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
                        <p>{googleDescription || "Google data will appear here when a place is selected."}</p>
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