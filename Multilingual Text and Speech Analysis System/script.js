// Get HTML elements
const textInput = document.getElementById("textInput");

const analyzeBtn = document.getElementById("analyzeBtn");

const voiceBtn = document.getElementById("voiceBtn");

const clearBtn = document.getElementById("clearBtn");

const language = document.getElementById("language");

const wordCount = document.getElementById("wordCount");

const charCount = document.getElementById("charCount");

const sentenceCount = document.getElementById("sentenceCount");

const sentiment = document.getElementById("sentiment");

const keywordList = document.getElementById("keywordList");

const summaryText = document.getElementById("summaryText");

const resultLanguage = document.getElementById("resultLanguage");

const speechStatus = document.getElementById("speechStatus");


// ================= TEXT ANALYSIS =================

analyzeBtn.addEventListener("click", function () {

    const text = textInput.value.trim();

    // Check empty input
    if (text === "") {

        alert("Please enter some text first.");

        return;
    }


    // Word count
    const words = text.split(/\s+/).filter(word => word.length > 0);

    wordCount.textContent = words.length;


    // Character count
    charCount.textContent = text.length;


    // Sentence count
    const sentences = text
        .split(/[.!?।]+/)
        .filter(sentence => sentence.trim().length > 0);

    sentenceCount.textContent = sentences.length;


    // Detect sentiment
    const detectedSentiment = detectSentiment(text);

    sentiment.textContent = detectedSentiment;


    // Extract keywords
    const keywords = getKeywords(words);

    displayKeywords(keywords);


    // Show selected language
    resultLanguage.textContent = language.value;


    // Summary
    summaryText.textContent =
        "The system analyzed " +
        words.length +
        " words in " +
        language.value +
        ". The detected sentiment is " +
        detectedSentiment +
        ". " +
        "The content contains " +
        sentences.length +
        " sentence(s).";

});


// ================= SENTIMENT ANALYSIS =================

function detectSentiment(text) {

    const positiveWords = [
        "good",
        "great",
        "excellent",
        "happy",
        "love",
        "amazing",
        "wonderful",
        "best",
        "nice",
        "success",
        "awesome",
        "thank"
    ];


    const negativeWords = [
        "bad",
        "sad",
        "hate",
        "angry",
        "worst",
        "terrible",
        "poor",
        "failure",
        "problem",
        "boring",
        "disappointed"
    ];


    const lowerText = text.toLowerCase();


    let positiveScore = 0;

    let negativeScore = 0;


    positiveWords.forEach(function (word) {

        if (lowerText.includes(word)) {

            positiveScore++;

        }

    });


    negativeWords.forEach(function (word) {

        if (lowerText.includes(word)) {

            negativeScore++;

        }

    });


    if (positiveScore > negativeScore) {

        return "Positive 😊";

    }

    else if (negativeScore > positiveScore) {

        return "Negative 😞";

    }

    else {

        return "Neutral 😐";

    }

}


// ================= KEYWORD EXTRACTION =================

function getKeywords(words) {

    const stopWords = [
        "the",
        "is",
        "a",
        "an",
        "and",
        "or",
        "to",
        "of",
        "in",
        "on",
        "for",
        "with",
        "this",
        "that",
        "are",
        "was",
        "were",
        "it",
        "my",
        "i",
        "you",
        "we",
        "they",
        "he",
        "she"
    ];


    const filteredWords = words
        .map(word => word.toLowerCase().replace(/[.,!?;:]/g, ""))
        .filter(word => word.length > 3)
        .filter(word => !stopWords.includes(word));


    const frequency = {};


    filteredWords.forEach(function (word) {

        if (frequency[word]) {

            frequency[word]++;

        }

        else {

            frequency[word] = 1;

        }

    });


    const sortedWords = Object.keys(frequency).sort(function (a, b) {

        return frequency[b] - frequency[a];

    });


    return sortedWords.slice(0, 8);

}


// ================= DISPLAY KEYWORDS =================

function displayKeywords(keywords) {

    keywordList.innerHTML = "";


    if (keywords.length === 0) {

        keywordList.innerHTML =
            "<span>No keywords found</span>";

        return;
    }


    keywords.forEach(function (keyword) {

        const span = document.createElement("span");

        span.textContent = keyword;

        keywordList.appendChild(span);

    });

}


// ================= CLEAR BUTTON =================

clearBtn.addEventListener("click", function () {

    textInput.value = "";

    wordCount.textContent = "0";

    charCount.textContent = "0";

    sentenceCount.textContent = "0";

    sentiment.textContent = "Neutral";

    resultLanguage.textContent = "English";

    keywordList.innerHTML =
        "<span>No keywords yet</span>";

    summaryText.textContent =
        'Enter text and click "Analyze Text" to see the analysis results.';

    speechStatus.textContent = "";

});


// ================= SPEECH RECOGNITION =================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition = new SpeechRecognition();

    recognition.continuous = false;

    recognition.interimResults = false;


    voiceBtn.addEventListener("click", function () {

        const selectedLanguage = language.value;


        // Set speech language
        if (selectedLanguage === "English") {
            recognition.lang = "en-IN";
        }

        else if (selectedLanguage === "Telugu") {
            recognition.lang = "te-IN";
        }

        else if (selectedLanguage === "Hindi") {
            recognition.lang = "hi-IN";
        }

        else if (selectedLanguage === "Tamil") {
            recognition.lang = "ta-IN";
        }

        else if (selectedLanguage === "Kannada") {
            recognition.lang = "kn-IN";
        }

        else if (selectedLanguage === "Malayalam") {
            recognition.lang = "ml-IN";
        }


        recognition.start();

        speechStatus.textContent =
            "🎙 Listening... Please speak now.";

        voiceBtn.textContent =
            "🔴 Listening...";

    });


    recognition.onresult = function (event) {

        const speechText =
            event.results[0][0].transcript;

        textInput.value += speechText + " ";

        speechStatus.textContent =
            "✅ Speech converted to text.";

        voiceBtn.textContent =
            "🎙 Start Speech";

    };


    recognition.onerror = function () {

        speechStatus.textContent =
            "❌ Speech recognition error. Please try again.";

        voiceBtn.textContent =
            "🎙 Start Speech";

    };


    recognition.onend = function () {

        voiceBtn.textContent =
            "🎙 Start Speech";

    };

}

else {

    voiceBtn.addEventListener("click", function () {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

    });

}