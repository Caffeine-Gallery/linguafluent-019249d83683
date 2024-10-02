import { backend } from 'declarations/backend';

const inputText = document.getElementById('inputText');
const targetLanguage = document.getElementById('targetLanguage');
const outputText = document.getElementById('outputText');
const speakButton = document.getElementById('speakButton');
const translationHistory = document.getElementById('translationHistory');

let lastTranslation = '';

// Function to translate text
async function translateText() {
    const text = inputText.value;
    const target = targetLanguage.value;

    if (text.trim() === '') {
        outputText.textContent = '';
        return;
    }

    try {
        const response = await fetch('https://libretranslate.de/translate', {
            method: 'POST',
            body: JSON.stringify({
                q: text,
                source: 'en',
                target: target
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        outputText.textContent = data.translatedText;
        lastTranslation = data.translatedText;

        // Add translation to history
        await backend.addTranslation(text, data.translatedText, target);
        updateTranslationHistory();
    } catch (error) {
        console.error('Translation error:', error);
        outputText.textContent = 'Translation error. Please try again.';
    }
}

// Function to speak the translated text
function speakTranslation() {
    if (lastTranslation) {
        const utterance = new SpeechSynthesisUtterance(lastTranslation);
        utterance.lang = targetLanguage.value;
        speechSynthesis.speak(utterance);
    }
}

// Function to update translation history
async function updateTranslationHistory() {
    const translations = await backend.getTranslations();
    translationHistory.innerHTML = '';
    translations.forEach(t => {
        const li = document.createElement('li');
        li.textContent = `${t.original} -> ${t.translated} (${t.targetLanguage})`;
        translationHistory.appendChild(li);
    });
}

// Event listeners
inputText.addEventListener('input', translateText);
targetLanguage.addEventListener('change', translateText);
speakButton.addEventListener('click', speakTranslation);

// Initial history update
updateTranslationHistory();
