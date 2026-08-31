import json
import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from google import genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not configured")

client = genai.Client(api_key=API_KEY)

app = FastAPI(title="AI Code Review Copilot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Code Review Backend is running"
    }


@app.post("/review")
def review_code(data: dict):

    code = data.get("code", "").strip()
    language = data.get("language", "Unknown")
    context = data.get("context", {})

    if not code:
        return {
            "error": "No code provided"
        }

    prompt = f"""
You are an expert senior software engineer performing an intelligent
code review.

Analyze the following {language} code.

Your review must evaluate:

1. Code quality
2. Security vulnerabilities
3. Logic errors
4. Reliability
5. Maintainability
6. Potential production impact
7. Recommended fixes
8. Tests that should be added

IMPORTANT:
- Do not invent issues that are not supported by the code.
- Be specific about why an issue exists.
- Prioritize the most important issues.
- If the code is good, say so.
- Return ONLY valid JSON.
- Do not wrap the JSON in markdown.

Return exactly this structure:

{{
  "risk_score": 0,
  "severity": "LOW",
  "summary": "Short overall assessment",
  "findings": [
    {{
      "category": "Security",
      "severity": "HIGH",
      "issue": "Short issue title",
      "explanation": "Why this is a problem",
      "impact": "Potential impact",
      "recommendation": "How to fix it",
      "test": "Suggested test"
    }}
  ],
  "decision": "APPROVE"
}}

Risk score:
0-30 = LOW
31-60 = MEDIUM
61-80 = HIGH
81-100 = CRITICAL

Decision must be one of:
APPROVE
REQUEST_CHANGES
BLOCK

IMPORTANT CONTEXT RULES:

Use the engineering context when evaluating risk.

Do not treat context as proof that a defect exists.

Use it to prioritize and explain risk.

For example:
- Similar historical defects can increase risk.
- Missing related tests can increase risk.
- Security standards can increase severity.
- A ticket describing a security-sensitive change should influence impact assessment.

Your findings must still be supported by the actual code.

ENGINEERING CONTEXT:

Repository:
{context.get("repository", "Not provided")}

Related Ticket:
{context.get("ticket", "Not provided")}

Coding Standards:
{context.get("standards", "Not provided")}

Recent Code History:
{context.get("history", "Not provided")}

Related Tests:
{context.get("tests", "Not provided")}


CODE TO REVIEW:

{code}
"""

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        result = json.loads(text)

        return result

    except json.JSONDecodeError:

        return {
            "error": "AI returned an invalid response format",
            "raw_response": response.text
        }

    except Exception as e:

        return {
            "error": f"AI review failed: {str(e)}"
        }