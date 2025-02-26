import { useState } from "react";
import { UserAuth } from "../context/AuthContext"
import { createReco } from "../services/recoServices";

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
    const { user } = UserAuth()
    console.log("const user = ", user)
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("food");
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProposed, setIsProposed] = useState(false);

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

    if (!isOpen) return null;



    return (
        <div className="modal-form">
            <div className="form-header">
                <h3>Add a New Reco</h3>
                <button className="close" onClick={onClose}>x</button>
            </div>

            <form>
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
        </div>
    );
}

export default RecoForm;