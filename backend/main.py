from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import fitz  # PyMuPDF
import docx
import spacy

load_dotenv()
app = FastAPI()
nlp = spacy.load("en_core_web_sm")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = client["resume_db"]

# Define skill keywords and job requirements
skill_keywords = ["Python", "FastAPI", "React", "MongoDB", "Docker", "HTML", "CSS", "JavaScript"]
job_required_skills = ["Python", "FastAPI", "MongoDB", "Docker"]

def extract_text(file: UploadFile):
    ext = file.filename.split(".")[-1].lower()
    if ext == "txt":
        return file.file.read().decode("utf-8")
    elif ext == "pdf":
        doc = fitz.open(stream=file.file.read(), filetype="pdf")
        return "\n".join([page.get_text() for page in doc])
    elif ext == "docx":
        doc = docx.Document(file.file)
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        return ""

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    text = extract_text(file)
    if not text.strip():
        return {
            "filename": file.filename,
            "extracted_skills": [],
            "match_score": 0.0,
            "missing_skills": job_required_skills
        }

    extracted_skills = [skill for skill in skill_keywords if skill.lower() in text.lower()]
    matched = set(extracted_skills) & set(job_required_skills)
    score = round(len(matched) / len(job_required_skills), 2)
    missing_skills = list(set(job_required_skills) - set(extracted_skills))

    db.resumes.insert_one({
        "filename": file.filename,
        "extracted_skills": extracted_skills,
        "match_score": score,
        "missing_skills": missing_skills
    })

    return {
        "filename": file.filename,
        "extracted_skills": extracted_skills,
        "match_score": score,
        "missing_skills": missing_skills
    }
