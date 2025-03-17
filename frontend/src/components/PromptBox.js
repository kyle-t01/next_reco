// component where queries to the AI are sent
import { useState } from "react";
import { fetchAIResponse } from "../services/aiServices";

const PromptBox = ({ user, reco, userPrompt, onAIResponse, onPromptChanged }) => {
    const [inititalPrompt, setInitialPrompt] = useState(userPrompt || "");
    const [isLoading, setIsLoading] = useState(false)
    const maxChars = 300;

    const handleSubmitPrompt = async (e) => {
        e.preventDefault();
        setIsLoading(true)
        console.log("handleSubmitPrompt() called");

        if (!user) {
            console.error("Must have a user!");
            setIsLoading(false)
            return;
        }

        try {
            const response = await fetchAIResponse(user, reco, inititalPrompt);
            console.log("AI Response:", response);

            if (onAIResponse) {
                onAIResponse(response);
            }
            setIsLoading(false)
        } catch (error) {
            console.error("Error generating AI response:", error);
            setIsLoading(false)
        }
    };


    return (
        <div className="prompt-bar">
            <textarea
                className="input"
                type="text"
                placeholder="Search, filter, and get AI-powered recommendations! You can also create Recos! Enter instructions here..."

                value={inititalPrompt}
                onChange={(e) => { setInitialPrompt(e.target.value); onPromptChanged(e.target.value) }}
                rows={3}
                maxLength={maxChars}
            />
            <div className="char-counter">
                {inititalPrompt.length} / {maxChars}
            </div>
            <button className="generate" onClick={handleSubmitPrompt} disabled={isLoading}>
                {isLoading ? "A.I. responding..." : "Send"}

            </button>
        </div>
    );
};

export default PromptBox;
