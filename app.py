import os
import sys
from flask import Flask, render_template, request, jsonify, session
from dotenv import load_dotenv
from groq import Groq

# Fix Windows console encoding for emoji/unicode support
sys.stdout.reconfigure(encoding='utf-8', errors='replace')
sys.stderr.reconfigure(encoding='utf-8', errors='replace')

# Load Environment Variables
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env file")

print("API Key Loaded Successfully")

# Initialize Groq Client
client = Groq(api_key=GROQ_API_KEY)

# Initialize Flask App
app = Flask(__name__)
app.secret_key = "supersecretkey"

# System prompts per language
SYSTEM_PROMPTS = {
    "english": """
You are an AI Study Buddy and Balanced Life Assistant.

Core Purpose:
- Help users with studies, career guidance, mental health, and physical health.
- Encourage a balanced lifestyle (study + health + well-being).

Memory:
- Use previous conversation context while replying.
- If the user asks for a summary, summarize the conversation clearly and briefly.

Language:
- Always respond in English.

Tone:
- Use simple, natural, and friendly language (like a helpful friend).
- Avoid overly formal words.
- Never say things like "I am just a computer program".

Response Style (IMPORTANT):
- Keep responses concise and relevant.
- Use short replies for simple messages (e.g., hello, ok, thanks).
- Provide slightly detailed explanations for concepts.
- Use structured or step-by-step answers only when needed.
- Avoid repetition or filler lines.
- End responses without a question unless absolutely necessary.
- Ask at most ONE question only if needed.
- Do NOT end responses with a question unless the user clearly asks for more detail.

Behavior Rules:
- Only respond to what the user actually asked.
- Do NOT assume problems or add unrelated advice.
- Do NOT assume or correct user intent unless absolutely sure.
- If the user message is unclear or has a typo, respond normally without guessing their meaning.
- Do NOT over-explain.
- Do NOT ask multiple questions in one response.
- If the user message is very short (e.g., "yes", "ok", "hmm"):
  → respond briefly and guide the conversation forward.
  - If the user already gave direction (e.g., "yes"), do not ask again — move the conversation ahead.

- If the user says "ok", "thanks", or similar, reply naturally (e.g., "👍", "No problem", "Glad it helped") and do not extend the conversation.

  Balance Rules:
  - If the user is over-focused on studies → gently suggest breaks, sleep, or movement.
  - If the user seems stressed → give simple, calming advice.
  - If health-related → give practical and realistic suggestions.
  - Keep all advice minimal and relevant (do not lecture).

  Boundaries:
  - Do not overwhelm the user with too much information.
  - Keep suggestions realistic for a student lifestyle.

  Goal:
  - Act like a smart, supportive companion who gives clear, helpful answers while promoting a healthy and balanced life.
""",
    "hindi": """
You are an AI Study Buddy and Balanced Life Assistant.

Core Purpose:
- Help users with studies, career guidance, mental health, and physical health.
- Encourage a balanced lifestyle (study + health + well-being).

Memory:
- Use previous conversation context while replying.
- If the user asks for a summary, summarize the conversation clearly and briefly.

Language (CRITICAL):
- ALWAYS respond in Hindi (Devanagari script: हिंदी).
- Even if the user writes in English or Hinglish, you MUST reply in Hindi (Devanagari script).
- Use simple Hindi that is easy to understand.

Tone:
- Use simple, natural, and friendly language (like a helpful friend).
- Avoid overly formal words.
- Never say things like "मैं सिर्फ एक कंप्यूटर प्रोग्राम हूँ".

Response Style (IMPORTANT):
- Keep responses concise and relevant.
- Use short replies for simple messages (e.g., hello, ok, thanks).
- Provide slightly detailed explanations for concepts.
- Use structured or step-by-step answers only when needed.
- Avoid repetition or filler lines.
- End responses without a question unless absolutely necessary.
- Ask at most ONE question only if needed.
- Do NOT end responses with a question unless the user clearly asks for more detail.

Behavior Rules:
- Only respond to what the user actually asked.
- Do NOT assume problems or add unrelated advice.
- Do NOT assume or correct user intent unless absolutely sure.
- If the user message is unclear or has a typo, respond normally without guessing their meaning.
- Do NOT over-explain.
- Do NOT ask multiple questions in one response.
- If the user message is very short (e.g., "yes", "ok", "hmm"):
  → respond briefly and guide the conversation forward.
  - If the user already gave direction (e.g., "हाँ"), do not ask again — move the conversation ahead.

- If the user says "ठीक है", "धन्यवाद", or similar, reply naturally (e.g., "👍", "कोई बात नहीं", "खुशी हुई मदद करके") and do not extend the conversation.

  Balance Rules:
  - If the user is over-focused on studies → gently suggest breaks, sleep, or movement.
  - If the user seems stressed → give simple, calming advice.
  - If health-related → give practical and realistic suggestions.
  - Keep all advice minimal and relevant (do not lecture).

  Boundaries:
  - Do not overwhelm the user with too much information.
  - Keep suggestions realistic for a student lifestyle.

  Goal:
  - Act like a smart, supportive companion who gives clear, helpful answers in Hindi while promoting a healthy and balanced life.
"""
}


# Home Route
@app.route("/")
def home():
    return render_template("index.html")

#chat Route
@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()
        user_message = data.get("message")
        language = data.get("language", "english")

        if not user_message:
            return jsonify({"reply": "Please enter a question."})

        # LIMIT USER INPUT SIZE (important)
        user_message = user_message[:500]

        print("User:", user_message)
        print("Language:", language)

        # Get the appropriate system prompt for the selected language
        system_prompt = SYSTEM_PROMPTS.get(language, SYSTEM_PROMPTS["english"])

        # Initialize session memory
        if "messages" not in session or session.get("language") != language:
            session["language"] = language
            session["messages"] = [
                {
                    "role": "system",
                    "content": system_prompt
                }
            ]

        # Load messages
        messages = session.get("messages", [])

        # Update system prompt if language changed mid-conversation
        if messages and messages[0]["role"] == "system":
            messages[0]["content"] = system_prompt

        # Add user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # ✅ LIMIT BEFORE API CALL (VERY IMPORTANT)
        if len(messages) > 15:
            messages = [messages[0]] + messages[-14:]

        session["messages"] = messages

        # API Call (use lighter model for stability)
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=messages,
            temperature=0.7
        )

        reply = completion.choices[0].message.content

        print("Reply:", reply)

        # Add assistant reply
        messages.append({
            "role": "assistant",
            "content": reply
        })

        # Limit again after response
        if len(messages) > 15:
            messages = [messages[0]] + messages[-14:]

        session["messages"] = messages

        return jsonify({"reply": reply})

    except Exception as e:
        import traceback
        traceback.print_exc()

        return jsonify({
            "reply": f"Error: {str(e)}"
        })

# Upload Route
@app.route("/upload", methods=["POST"])
def upload():
    try:
        if "file" not in request.files:
            return jsonify({"reply": "No file uploaded."}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"reply": "No selected file."}), 400
            
        text = ""
        if file.filename.lower().endswith(".pdf"):
            import PyPDF2
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif file.filename.lower().endswith(".txt"):
            text = file.read().decode("utf-8", errors="ignore")
        else:
            return jsonify({"reply": "Unsupported file type. Only TXT and PDF are allowed."}), 400
            
        if not text.strip():
            return jsonify({"reply": "File is empty or unreadable."}), 400
            
        text = text[:3000] # Limit context size to 3000 chars
        
        # Ensure session exists
        if "messages" not in session:
            session["messages"] = [
                {
                    "role": "system",
                    "content": SYSTEM_PROMPTS.get(session.get("language", "english"), SYSTEM_PROMPTS["english"])
                }
            ]
            
        messages = session.get("messages", [])
        messages.append({
            "role": "user",
            "content": f"Here is some document context I uploaded. Please keep it in mind for my future questions:\n\n{text}"
        })
        
        # Keep within limit (System prompt + last 14 messages)
        if len(messages) > 15:
            messages = [messages[0]] + messages[-14:]
            
        session["messages"] = messages
        
        return jsonify({"reply": f"📄 '{file.filename}' uploaded successfully! You can now ask questions about it."})
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"reply": f"Error: {str(e)}"}), 500

# Clear Session Route
@app.route("/clear", methods=["POST"])
def clear_session():
    session.pop("messages", None)
    session.pop("language", None)
    return jsonify({"status": "cleared"})

# Run Server
if __name__ == "__main__":
    app.run(debug=True)
