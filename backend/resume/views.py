
import re
import os
import shutil
from io import BytesIO

import fitz
import pytesseract
from PIL import Image
from pypdf import PdfReader

from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status


# Cross-platform Tesseract configuration
TESSERACT_PATH = shutil.which("tesseract")

if not TESSERACT_PATH:
    WINDOWS_TESSERACT_PATH = (
        r"C:\Program Files\Tesseract-OCR\tesseract.exe"
    )

    if os.path.isfile(WINDOWS_TESSERACT_PATH):
        TESSERACT_PATH = WINDOWS_TESSERACT_PATH

if TESSERACT_PATH:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_PATH


MAX_FILE_SIZE = 5 * 1024 * 1024

SKILLS = [
    "python", "java", "javascript", "typescript", "c", "c++",
    "html", "css", "react", "angular", "vue", "node.js",
    "express", "django", "flask", "sql", "mysql", "postgresql",
    "mongodb", "firebase", "git", "github", "docker", "aws",
    "azure", "machine learning", "deep learning",
    "artificial intelligence", "data analysis", "pandas", "numpy",
    "tensorflow", "pytorch", "scikit-learn", "opencv", "rest api",
    "bootstrap", "tailwind", "redux", "jest", "webpack", "babel",
    "axios", "react router", "communication", "leadership",
    "problem solving"
]

STOP_WORDS = {
    "the", "and", "for", "with", "you", "your", "are", "our",
    "this", "that", "from", "will", "have", "has", "was",
    "were", "who", "what", "when", "where", "how", "can",
    "should", "must", "required", "requirements", "experience",
    "years", "year", "work", "working", "job", "role",
    "candidate", "ability", "strong", "good", "knowledge",
    "skills", "skill", "using", "use", "into", "their",
    "they", "them", "about", "such", "also", "not", "all",
    "any", "etc", "per", "one", "two", "new"
}

ACTION_WORDS = [
    "developed", "implemented", "designed", "created",
    "managed", "built", "improved", "optimized",
    "analyzed", "led", "delivered", "maintained",
    "automated", "integrated", "collaborated",
    "achieved", "deployed", "tested", "configured"
]


def find_skills(text):
    text_lower = text.lower()
    found = []

    for skill in SKILLS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"

        if re.search(pattern, text_lower):
            found.append(skill)

    return sorted(set(found))


def extract_resume_text(uploaded_file):
    if not uploaded_file:
        raise ValueError("Please upload a PDF resume.")

    if not uploaded_file.name.lower().endswith(".pdf"):
        raise ValueError("Only PDF files are supported.")

    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValueError("PDF size must be less than 5 MB.")

    pdf_bytes = uploaded_file.read()

    if not pdf_bytes:
        raise ValueError("The uploaded PDF is empty.")

    extracted_text = ""

    try:
        reader = PdfReader(BytesIO(pdf_bytes))

        if reader.is_encrypted:
            raise ValueError("Password-protected PDFs are not supported.")

        for page in reader.pages:
            extracted_text += (page.extract_text() or "") + "\n"

    except ValueError:
        raise
    except Exception:
        extracted_text = ""

    if len(extracted_text.strip()) >= 30:
        return extracted_text.strip()

    try:
        document = fitz.open(stream=pdf_bytes, filetype="pdf")

        if document.page_count == 0:
            raise ValueError("The PDF does not contain any pages.")

        if document.page_count > 10:
            document.close()
            raise ValueError(
                "For scanned PDFs, please upload a document with 10 pages or fewer."
            )

        ocr_text = []

        for page in document:
            pixmap = page.get_pixmap(
                matrix=fitz.Matrix(2, 2),
                alpha=False
            )

            image = Image.open(BytesIO(pixmap.tobytes("png")))

            page_text = pytesseract.image_to_string(
                image,
                lang="eng"
            )

            ocr_text.append(page_text)

        document.close()

        final_text = "\n".join(ocr_text).strip()

        if len(final_text) < 10:
            raise ValueError(
                "Could not read text from this PDF. Please upload a clearer PDF."
            )

        return final_text

    except ValueError:
        raise
    except Exception as error:
        raise ValueError(
            "OCR could not process this PDF. Please check your Tesseract installation. "
            + str(error)
        )


def calculate_ats_score(text, detected_skills):
    text_lower = text.lower()
    word_count = len(text.split())

    breakdown = []
    suggestions = []
    score = 0

    # 1. Contact information: 15 points
    email_found = bool(
        re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    )

    phone_found = bool(
        re.search(r"(?:\+?\d[\d\s().-]{7,}\d)", text)
    )

    contact_score = 0

    if email_found:
        contact_score += 8
    else:
        suggestions.append("Add a valid email address to your resume.")

    if phone_found:
        contact_score += 7
    else:
        suggestions.append("Add a contact phone number to your resume.")

    score += contact_score

    breakdown.append({
        "category": "Contact Information",
        "score": contact_score,
        "max_score": 15
    })

    # 2. Resume sections: 25 points
    section_score = 0

    sections = {
        "Experience": (
            r"\b(work experience|professional experience|employment history|"
            r"experience|internship)\b",
            10
        ),
        "Education": (
            r"\b(education|academic background|qualification)\b",
            5
        ),
        "Projects": (
            r"\b(projects|personal projects|academic projects)\b",
            5
        ),
        "Skills": (
            r"\b(technical skills|skills|core competencies|key skills)\b",
            5
        )
    }

    detected_sections = []

    for section, (pattern, points) in sections.items():
        if re.search(pattern, text_lower):
            section_score += points
            detected_sections.append(section)
        else:
            suggestions.append(
                "Add a clearly labelled " + section + " section."
            )

    score += section_score

    breakdown.append({
        "category": "Resume Sections",
        "score": section_score,
        "max_score": 25
    })

    # 3. Technical skills: 25 points
    skill_count = len(detected_skills)

    if skill_count >= 10:
        skill_score = 25
    elif skill_count >= 8:
        skill_score = 22
    elif skill_count >= 5:
        skill_score = 18
    elif skill_count >= 3:
        skill_score = 12
    elif skill_count >= 1:
        skill_score = 6
    else:
        skill_score = 0

    score += skill_score

    breakdown.append({
        "category": "Technical Skills",
        "score": skill_score,
        "max_score": 25
    })

    if skill_count < 5:
        suggestions.append(
            "Add more relevant technical skills that match your target job."
        )

    # 4. Resume content and detail: 15 points
    if 250 <= word_count <= 900:
        content_score = 15
    elif 150 <= word_count < 250 or 900 < word_count <= 1200:
        content_score = 11
    elif 80 <= word_count < 150 or 1200 < word_count <= 1500:
        content_score = 7
    else:
        content_score = 3

    score += content_score

    breakdown.append({
        "category": "Resume Content",
        "score": content_score,
        "max_score": 15
    })

    if word_count < 250:
        suggestions.append(
            "Add more relevant details about your work, projects, and achievements."
        )
    elif word_count > 900:
        suggestions.append(
            "Keep your resume concise and focus on the most relevant information."
        )

    # 5. Measurable achievements: 10 points
    measurable_results = re.findall(
        r"\b\d+(?:\.\d+)?\s*(?:%|percent|users|projects|clients|"
        r"months|years|hours|days|teams|applications)\b",
        text_lower
    )

    achievement_score = min(10, len(measurable_results) * 3)

    score += achievement_score

    breakdown.append({
        "category": "Measurable Achievements",
        "score": achievement_score,
        "max_score": 10
    })

    if achievement_score < 6:
        suggestions.append(
            "Include measurable results, such as performance improvements, "
            "project outcomes, or the number of users served."
        )

    # 6. Action words: 10 points
    action_count = sum(
        1 for word in ACTION_WORDS
        if re.search(r"\b" + re.escape(word) + r"\b", text_lower)
    )

    action_score = min(10, action_count * 2)

    score += action_score

    breakdown.append({
        "category": "Action Words",
        "score": action_score,
        "max_score": 10
    })

    if action_count < 3:
        suggestions.append(
            "Use strong action words such as Developed, Implemented, "
            "Designed, and Optimized to describe your work."
        )

    score = min(100, max(0, score))

    if score >= 85:
        rating = "Excellent Resume!"
    elif score >= 70:
        rating = "Good Resume!"
    elif score >= 50:
        rating = "Needs Improvement"
    else:
        rating = "Resume Needs More Work"

    if not suggestions:
        suggestions.append(
            "Good work! Continue tailoring your resume to each job description."
        )

    return score, rating, breakdown, suggestions, detected_sections


@api_view(["GET"])
def home(request):
    return Response({
        "message": "Welcome to ResumeAI API",
        "status": "success",
        "features": [
            "Resume Builder",
            "ATS Score Checker",
            "Job Description Matcher"
        ]
    })


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def ats_check(request):
    uploaded_file = request.FILES.get("resume")

    try:
        resume_text = extract_resume_text(uploaded_file)

        detected_skills = find_skills(resume_text)

        missing_keywords = [
            skill for skill in SKILLS
            if skill not in detected_skills
        ][:10]

        score, rating, breakdown, suggestions, detected_sections = (
            calculate_ats_score(resume_text, detected_skills)
        )

        return Response({
            "score": score,
            "ats_score": score,
            "rating": rating,
            "detected_skills": detected_skills,
            "missing_keywords": missing_keywords,
            "suggestions": suggestions,
            "score_breakdown": breakdown,
            "detected_sections": detected_sections,
            "word_count": len(resume_text.split()),
            "message": "Resume analyzed successfully."
        })

    except ValueError as error:
        return Response(
            {"error": str(error)},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        return Response(
            {"error": "Something went wrong while analyzing the resume."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def job_match(request):
    uploaded_file = request.FILES.get("resume")
    job_description = request.data.get("job_description", "")

    if not job_description or not job_description.strip():
        return Response(
            {"error": "Please enter a job description."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        resume_text = extract_resume_text(uploaded_file)

        resume_skills = find_skills(resume_text)
        job_skills = find_skills(job_description)

        matching_skills = [
            skill for skill in job_skills
            if skill in resume_skills
        ]

        missing_skills = [
            skill for skill in job_skills
            if skill not in resume_skills
        ]

        if job_skills:
            match_percentage = round(
                (len(matching_skills) / len(job_skills)) * 100
            )
        else:
            resume_words = {
                word for word in re.findall(
                    r"\b[a-zA-Z]{3,}\b",
                    resume_text.lower()
                )
                if word not in STOP_WORDS
            }

            job_words = {
                word for word in re.findall(
                    r"\b[a-zA-Z]{3,}\b",
                    job_description.lower()
                )
                if word not in STOP_WORDS
            }

            common_words = resume_words.intersection(job_words)

            if job_words:
                match_percentage = round(
                    (len(common_words) / len(job_words)) * 100
                )
            else:
                match_percentage = 0

        suggestions = []

        if missing_skills:
            suggestions.append(
                "Consider adding these relevant skills if you genuinely have them: "
                + ", ".join(missing_skills)
            )

        if not matching_skills:
            suggestions.append(
                "Your resume does not show a clear match with the detected job requirements."
            )

        if len(resume_text.split()) < 100:
            suggestions.append(
                "Add more details about your projects, education, and work experience."
            )

        if not suggestions:
            suggestions.append(
                "Good job! Your resume includes the detected skills required for this role."
            )

        return Response({
            "match_percentage": match_percentage,
            "matching_skills": matching_skills,
            "missing_skills": missing_skills,
            "resume_skills": resume_skills,
            "job_skills": job_skills,
            "suggestions": suggestions,
            "message": "Job description matching completed successfully."
        })

    except ValueError as error:
        return Response(
            {"error": str(error)},
            status=status.HTTP_400_BAD_REQUEST
        )

    except Exception:
        return Response(
            {"error": "Something went wrong while matching the resume."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
