// component where queries to the AI are sent
import { useState } from "react";
import { fetchAIResponse } from "../services/aiServices";

const PromptBox = ({ user, reco, userPrompt, onAIResponse }) => {
    const [inititalPrompt, setInitialPrompt] = useState(userPrompt || "");
    const maxChars = 300;

    const handleSubmitPrompt = async (e) => {
        e.preventDefault();
        console.log("handleSubmitPrompt() called");

        if (!user) {
            console.error("Must have a user!");
            return;
        }

        try {
            const response = await fetchAIResponse(user, reco, userPrompt);
            console.log("AI Response:", response);

            if (onAIResponse) {
                onAIResponse(response);
            }
        } catch (error) {
            console.error("Error generating AI response:", error);
        }
    };

    return (
        <div className="prompt-bar">
            <textarea
                className="input"
                type="text"
                placeholder="Use A.I. to automatically create, update, delete and even filter Recos!! Enter prompt here..."
                value={inititalPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                rows={3}
                maxLength={maxChars}
            />
            <div className="char-counter">
                {inititalPrompt.length} / {maxChars}
            </div>
            <button className="generate" onClick={handleSubmitPrompt}>
                {"Generate"}
            </button>
        </div>
    );
};

export default PromptBox;
