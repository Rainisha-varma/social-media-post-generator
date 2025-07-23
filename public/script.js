document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const topicInput = document.getElementById('topic');
    const toneInput = document.getElementById('tone');
    const platformInput = document.getElementById('platform');
    const addHashtagsToggle = document.getElementById('addHashtags'); // Get reference to toggle
    const addEmojisToggle = document.getElementById('addEmojis');     // Get reference to toggle
    const generatedPostElem = document.getElementById('generatedPost');
    const copyBtn = document.getElementById('copyBtn');

    generateBtn.addEventListener('click', async () => {
        const topic = topicInput.value.trim();
        const tone = toneInput.value.trim();
        const platform = platformInput.value.trim();
        const addHashtags = addHashtagsToggle.checked; // Get checked state
        const addEmojis = addEmojisToggle.checked;     // Get checked state

        if (!topic) {
            alert('Please enter a topic or keywords!');
            // Also hide the copy button if the user tries to generate with an empty topic
            copyBtn.style.display = 'none';
            return;
        }

        generatedPostElem.textContent = 'Generating...';
        generatedPostElem.style.color = '#555';
        copyBtn.style.display = 'none'; // Hide copy button while generating

        try {
            const response = await fetch('/generate-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ topic, tone, platform, addHashtags, addEmojis }), // Send toggle states
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Something went wrong on the server.');
            }

            const data = await response.json();
            generatedPostElem.textContent = data.post;
            generatedPostElem.style.color = '#333';
            copyBtn.style.display = 'block'; // <<<--- ADD THIS LINE TO SHOW THE BUTTON

        } catch (error) {
            console.error('Error:', error);
            generatedPostElem.textContent = `Error: ${error.message}. Please try again.`;
            generatedPostElem.style.color = 'red';
            copyBtn.style.display = 'none'; // Ensure button is hidden on error
        }
    });

    copyBtn.addEventListener('click', () => {
        // Prevent copying "Generating...", "Error:", or initial placeholder text
        const textToCopy = generatedPostElem.textContent;
        if (textToCopy && textToCopy !== 'Your AI-generated post will appear here.' && !textToCopy.startsWith('Generating...') && !textToCopy.startsWith('Error:')) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy'; // Revert text after a short delay
                    }, 1500);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy the post. Please try again manually.');
                });
        }
    });
});