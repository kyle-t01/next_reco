import { useState, useRef } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco } from "../services/recoServices";
import { GoogleMap, useJsApiLoader, StandaloneSearchBox } from "@react-google-maps/api"



/*
    title
    category
    address
    description
    is_private
    is_proposed
    uid

*/

const RecoForm = ({ isOpen, onClose, onRecoAdded }) => {
    const inputRef = useRef(null)

    // load the google maps api
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,
        libraries: ["places"]
    });
    console.log("isLoaded: ", isLoaded)


    const { user } = UserAuth()
    console.log("const user = ", user)
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("food");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProposed, setIsProposed] = useState(false);


    const renderSearchBar = () => {
        if (!isLoaded) return;

        return <div>
            <StandaloneSearchBox
                onLoad={(ref) => inputRef.current = ref}
                onPlacesChanged={handleOnPlacesChanged}
            >
                <input
                    type="text"
                    placehoder="Type an address"


                />
            </StandaloneSearchBox>
        </div>
    }

    const handleOnPlacesChanged = () => {
        if (!inputRef) return;
        const placeDetails = inputRef.current.getPlaces()
        // gives the details that has been autofilled
        const placeInfo = placeDetails[0]

        // now set and update any fields in the form
        setTitle(placeInfo.name)
        setAddress(placeInfo.formatted_address)
        const website = placeInfo.website || "Website not available";
        const googleMapsUrl = placeInfo.url || "Google Maps link not available";
        const descString = `📍${googleMapsUrl}\n🌐 ${website}`
        setDescription(descString);
    }




    const handleSubmit = async (e) => {
        e.preventDefault()
        const uid = user.uid;
        const newReco = { title, category, address, description, isPrivate, isProposed, uid }
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
        setCategory("food")
        setAddress("")
        setDescription("")
        setIsPrivate(false)
        setIsProposed(false)

    }

    if (!isOpen) return null;



    return (
        <div className="modal-form" >
            <div className="form-header">
                <h3>Add a New Reco</h3>
                <button className="close" onClick={resetForm}>[reset]</button>
            </div>

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
                {/* Address */}
                <label>Address</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                {/* Category */}
                <label>Category</label>
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
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
                        Private
                    </label>
                    {/* isProposed */}
                    <label>

                        <input
                            type="checkbox"
                            checked={isProposed}
                            onChange={(e) => setIsProposed(e.target.checked)}
                        />
                        Proposed
                    </label>
                </div>

                {/* buttons */}
                <div className="button-group">
                    <button type="button" className="cancel" onClick={onClose}>Cancel</button>
                    <button type="submit" className="submit" onClick={handleSubmit}>Add Reco</button>
                </div>

            </form>
        </div >
    );
}

export default RecoForm;