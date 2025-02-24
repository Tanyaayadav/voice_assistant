if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
// Voice Assistant Code
let btn = document.querySelector("#btn");
let content = document.querySelector("#content");
let voice = document.querySelector("#voice");

function speak(text) {
    let text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;
    text_speak.lang = "en-GB";
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    let day = new Date();
    let hours = day.getHours();
    
    if (hours >= 0 && hours < 12) {
        speak("Good Morning, Sir");
    } else if (hours >= 12 && hours < 16) {
        speak("Good Afternoon, Sir");
    } else {
        speak("Good Evening, Sir");
    }
}

let speechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = new speechRecognition();

recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
    let transcript = event.results[0][0].transcript.toLowerCase();
    content.innerText = transcript;
    takeCommand(transcript);
};

recognition.onerror = (event) => {
    console.log("Speech recognition error:", event.error);
    speak("Sorry, I didn't catch that. Can you say it again?");
};

btn.addEventListener("click", () => {
    recognition.start();
    voice.style.display = "block";
    btn.style.display = "none";
});

function takeCommand(message) {
    voice.style.display = "none";
    btn.style.display = "flex";

    // Update the summary box with the voice input
    let summaryBox = document.getElementById("summary-text");
    summaryBox.innerText = message;

    // Check for meeting-related phrases
    if (message.includes("meeting at")) {
        let time = extractTimeFromMessage(message);
        if (time) {
            speak(`Opening calendar for a meeting at ${time}.`);
            openCalendar();
        } else {
            speak("I couldn't find the time for the meeting. Can you please specify the time?");
        }
    } else if (message.includes("arrange a meeting") || message.includes("schedule a meeting")) {
        let time = extractTimeFromMessage(message);
        if (time) {
            speak(`Meeting added at ${time}.`);
            console.log(`Meeting added at ${time}.`);
        } else {
            speak("Meeting added.");
            console.log("Meeting added to the schedule.");
        }
    } else if (message.includes("hello") || message.includes("hey")) {
        speak("Hello sir, what can I help you with?");
    } else if (message.includes("who are you")) {
        speak("I am your virtual assistant, created by Ayush Sir.");
    } else if (message.includes("open youtube")) {
        speak("Opening YouTube...");
        window.open("https://youtube.com/", "_blank");
    } else if (message.includes("open google")) {
        speak("Opening Google...");
        window.open("https://google.com/", "_blank");
    } else if (message.includes("open facebook")) {
        speak("Opening Facebook...");
        window.open("https://facebook.com/", "_blank");
    } else if (message.includes("open instagram")) {
        speak("Opening Instagram...");
        window.open("https://instagram.com/", "_blank");
    } else if (message.includes("open calculator")) {
        speak("Opening calculator...");
        window.open("calculator://");
    } else if (message.includes("open whatsapp")) {
        speak("Opening WhatsApp...");
        window.open("whatsapp://");
    } else if (message.includes("time")) {
        let time = new Date().toLocaleTimeString();
        speak("The current time is " + time);
    } else if (message.includes("date")) {
        let date = new Date().toDateString();
        speak("Today's date is " + date);
    } else if (message.includes("weather")) {
        speak("Fetching weather details...");
        window.open("https://www.weather.com/", "_blank");
    } else {
        let searchQuery = message.replace(/shipra|shifra/g, "").trim();
        let finalText = "Here is what I found on the internet about " + searchQuery;
        speak(finalText);
        window.open(`https://www.google.com/search?q=${searchQuery}`, "_blank");
    }
}

// Function to extract time from the message
function extractTimeFromMessage(message) {
    // Regex to match time patterns like "2 PM", "2:30 PM", "14:00", etc.
    let timeRegex = /(\d{1,2}(:\d{2})?\s?(AM|PM)?)/i;
    let match = message.match(timeRegex);
    if (match) {
        return match[0]; // Return the matched time
    }
    return null; // Return null if no time is found
}

// Function to open the calendar
function openCalendar() {
    // Replace this with the actual calendar URL or functionality
    window.open("https://calendar.google.com/", "_blank");
    speak("Opening your calendar.");
}

// Open Email Client
document.getElementById("email-btn").addEventListener("click", function () {
    window.location.href = "mailto:"; // Opens the default email client
});
