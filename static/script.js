/* ============================================
   AI Study Buddy — Enhanced Script
   Multilingual | Welcome Message | Typing Indicator
   All existing features preserved
   ============================================ */

/* ---------------------- */
/* DOM Elements           */
/* ---------------------- */
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const chatBox = document.getElementById("chatBox");
const chatList = document.getElementById("chatList");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");
const micBtn = document.getElementById("mic-btn");
const langSelect = document.getElementById("language-select");
const newChatBtn = document.getElementById("newChatBtn");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("sidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");

/* ---------------------- */
/* State                  */
/* ---------------------- */
let chats = JSON.parse(localStorage.getItem("chats")) || [];
let currentChatId = null;

/* ---------------------- */
/* Multilingual Content   */
/* ---------------------- */
const i18n = {
    english: {
        welcomeTitle: "Hello! I'm your AI Study Buddy 👋",
        welcomeSubtitle: "I'm here to help you with your studies, answer questions, provide career guidance, and support your well-being. Ask me anything!",
        chips: [
            "📖 Explain a concept",
            "📝 Help me study",
            "💡 Career guidance",
            "🧘 Stress relief tips"
        ],
        placeholder: "Message AI Study Buddy...",
        typingLabel: "Thinking...",
        uploadSuccess: "uploaded successfully! You can now ask questions about it.",
        uploadError: "Error uploading file.",
        serverError: "Error connecting to server.",
        emptyMessage: "Please type a message first."
    },
    hindi: {
        welcomeTitle: "नमस्ते! मैं आपका AI स्टडी बडी हूँ 👋",
        welcomeSubtitle: "मैं आपकी पढ़ाई में मदद करने, सवालों के जवाब देने, करियर मार्गदर्शन प्रदान करने और आपकी भलाई में सहायता करने के लिए यहाँ हूँ। कुछ भी पूछें!",
        chips: [
            "📖 कोई कॉन्सेप्ट समझाओ",
            "📝 पढ़ाई में मदद करो",
            "💡 करियर गाइडेंस दो",
            "🧘 तनाव कम करने के टिप्स"
        ],
        placeholder: "AI Study Buddy को मैसेज करें...",
        typingLabel: "सोच रहा हूँ...",
        uploadSuccess: "सफलतापूर्वक अपलोड हो गया! अब आप इसके बारे में सवाल पूछ सकते हैं।",
        uploadError: "फ़ाइल अपलोड करने में त्रुटि।",
        serverError: "सर्वर से कनेक्ट करने में त्रुटि।",
        emptyMessage: "कृपया पहले एक संदेश टाइप करें।"
    }
};

/* ---------------------- */
/* Get Current Language   */
/* ---------------------- */
function getLang() {
    return langSelect.value || "english";
}

function t(key) {
    const lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || i18n.english[key] || key;
}

/* ---------------------- */
/* Clear Backend Session  */
/* ---------------------- */
async function clearBackendSession() {
    try {
        await fetch("/clear", { method: "POST" });
    } catch (e) {
        console.error("Failed to clear session:", e);
    }
}

/* ---------------------- */
/* Welcome Message        */
/* ---------------------- */
function showWelcomeMessage() {
    chatBox.innerHTML = "";

    const container = document.createElement("div");
    container.classList.add("welcome-container");
    container.id = "welcomeContainer";

    const icon = document.createElement("div");
    icon.classList.add("welcome-icon");
    icon.textContent = "🎓";

    const title = document.createElement("h1");
    title.classList.add("welcome-title");
    title.textContent = t("welcomeTitle");

    const subtitle = document.createElement("p");
    subtitle.classList.add("welcome-subtitle");
    subtitle.textContent = t("welcomeSubtitle");

    const chips = document.createElement("div");
    chips.classList.add("welcome-chips");

    t("chips").forEach(chipText => {
        const chip = document.createElement("button");
        chip.classList.add("welcome-chip");
        chip.textContent = chipText;
        chip.addEventListener("click", () => {
            input.value = chipText;
            input.focus();
            sendMessage();
        });
        chips.appendChild(chip);
    });

    container.appendChild(icon);
    container.appendChild(title);
    container.appendChild(subtitle);
    container.appendChild(chips);

    chatBox.appendChild(container);
}

/* ---------------------- */
/* Remove Welcome         */
/* ---------------------- */
function removeWelcome() {
    const welcome = document.getElementById("welcomeContainer");
    if (welcome) welcome.remove();
}

/* ---------------------- */
/* Create New Chat        */
/* ---------------------- */
function createNewChat() {
    clearBackendSession();

    const newChat = {
        id: Date.now(),
        name: "New Chat",
        messages: []
    };

    chats.unshift(newChat);
    currentChatId = newChat.id;

    saveChats();
    renderChats();
    loadChat();
}

/* ---------------------- */
/* Save to localStorage   */
/* ---------------------- */
function saveChats() {
    localStorage.setItem("chats", JSON.stringify(chats));
}

/* ---------------------- */
/* Delete Chat            */
/* ---------------------- */
function deleteChat(id) {
    chats = chats.filter(c => c.id !== id);
    saveChats();

    if (chats.length === 0) {
        createNewChat();
    } else if (currentChatId === id) {
        currentChatId = chats[0].id;
        clearBackendSession();
        loadChat();
        renderChats();
    } else {
        renderChats();
    }
}

/* ---------------------- */
/* Render Sidebar         */
/* ---------------------- */
function renderChats() {
    chatList.innerHTML = "";

    chats.forEach(chat => {
        const div = document.createElement("div");
        div.classList.add("chat-item");
        if (chat.id === currentChatId) div.classList.add("active");

        const textSpan = document.createElement("span");
        textSpan.classList.add("chat-item-text");
        textSpan.textContent = chat.name;

        textSpan.onclick = () => {
            if (currentChatId !== chat.id) {
                currentChatId = chat.id;
                clearBackendSession();
                loadChat();
                renderChats();
                closeSidebar();
            }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("chat-delete-btn");
        deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
        deleteBtn.title = "Delete chat";
        deleteBtn.onclick = (e) => {
            e.stopPropagation();
            deleteChat(chat.id);
        };

        div.appendChild(textSpan);
        div.appendChild(deleteBtn);
        chatList.appendChild(div);
    });
}

/* ---------------------- */
/* Load Chat Messages     */
/* ---------------------- */
function loadChat() {
    const chat = chats.find(c => c.id === currentChatId);
    if (!chat) return;

    chatBox.innerHTML = "";

    if (chat.messages.length === 0) {
        showWelcomeMessage();
    } else {
        chat.messages.forEach(msg => {
            addMessage(msg.text, msg.type, false);
        });
    }
}

/* ---------------------- */
/* Add Message UI         */
/* ---------------------- */
function addMessage(text, type, save = true) {
    removeWelcome();

    const message = document.createElement("div");
    message.classList.add("message", type);
    message.innerHTML = marked.parse(text);

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;

    if (save) {
        const chat = chats.find(c => c.id === currentChatId);
        if (chat) {
            chat.messages.push({ text, type });

            /* Auto-name chat from first user message */
            if (chat.name === "New Chat" && type === "user-message") {
                chat.name = text.slice(0, 25) + (text.length > 25 ? "..." : "");
            }

            saveChats();
            renderChats();
        }
    }
}

/* ---------------------- */
/* Typing Indicator       */
/* ---------------------- */
function showTypingIndicator() {
    const indicator = document.createElement("div");
    indicator.classList.add("typing-indicator");
    indicator.id = "typingIndicator";

    const dots = document.createElement("div");
    dots.classList.add("typing-dots");
    dots.innerHTML = "<span></span><span></span><span></span>";

    const label = document.createElement("span");
    label.classList.add("typing-label");
    label.textContent = t("typingLabel");

    indicator.appendChild(dots);
    indicator.appendChild(label);

    chatBox.appendChild(indicator);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("typingIndicator");
    if (indicator) indicator.remove();
}

/* ---------------------- */
/* Send Message           */
/* ---------------------- */
async function sendMessage() {
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, "user-message");
    input.value = "";

    showTypingIndicator();

    try {
        const res = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: message,
                language: getLang()
            })
        });

        const data = await res.json();

        removeTypingIndicator();
        addMessage(data.reply, "bot-message");

    } catch (err) {
        removeTypingIndicator();
        addMessage(t("serverError"), "bot-message");
    }
}

/* ---------------------- */
/* Voice Command          */
/* ---------------------- */
let recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function () {
        micBtn.classList.add("recording");
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        input.value += transcript + " ";
        micBtn.classList.remove("recording");
        input.focus();
    };

    recognition.onerror = function () {
        micBtn.classList.remove("recording");
    };

    recognition.onend = function () {
        micBtn.classList.remove("recording");
    };
}

micBtn.addEventListener("click", () => {
    if (recognition) {
        /* Set recognition language based on selector */
        const langMap = { english: "en-US", hindi: "hi-IN" };
        recognition.lang = langMap[getLang()] || "en-US";
        recognition.start();
    } else {
        alert("Speech recognition is not supported in your browser.");
    }
});

/* ---------------------- */
/* File Upload            */
/* ---------------------- */
attachBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", async () => {
    if (fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    addMessage(`📎 Uploading ${file.name}...`, "user-message");

    showTypingIndicator();

    try {
        const res = await fetch("/upload", {
            method: "POST",
            body: formData
        });
        const data = await res.json();

        removeTypingIndicator();
        addMessage(data.reply, "bot-message");
    } catch (err) {
        removeTypingIndicator();
        addMessage(t("uploadError"), "bot-message");
    }

    fileInput.value = "";
});

/* ---------------------- */
/* Language Change         */
/* ---------------------- */
langSelect.addEventListener("change", () => {
    input.placeholder = t("placeholder");

    /* If welcome is showing, refresh it */
    const welcome = document.getElementById("welcomeContainer");
    if (welcome) {
        showWelcomeMessage();
    }
});

/* ---------------------- */
/* Sidebar Toggle (Mobile)*/
/* ---------------------- */
function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("active");
}

sidebarToggle.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarOverlay.addEventListener("click", closeSidebar);

/* ---------------------- */
/* Events                 */
/* ---------------------- */
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
});

newChatBtn.addEventListener("click", () => {
    createNewChat();
    closeSidebar();
});

/* ---------------------- */
/* Init                   */
/* ---------------------- */
input.placeholder = t("placeholder");

if (chats.length === 0) {
    createNewChat();
} else {
    currentChatId = chats[0].id;
    renderChats();
    loadChat();
}