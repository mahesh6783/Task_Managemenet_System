-------------------------------------------
✅ 1. PROJECT REQUIREMENTS
-------------------------------------------
Backend:
Python 3.10+
Django 4+
Django REST Framework
SimpleJWT
ReportLab (PDF)
HuggingFace Transformers
Torch

Frontend:
Node.js 18+
React.js (Vite or Create-React-App)


-------------------------------------------
✅ 2. BACKEND SETUP (DJANGO)
-------------------------------------------

Go to task_management folder and run

✅ Step 1 — Install Requirements
pip install -r requirements.txt

✅ Step 2 — Apply Migrations
python manage.py migrate

✅ Step 3 — Create Superuser (Admin Login)
python manage.py createsuperuser

✅ Step 4 — Run Django Server
python manage.py runserver

Your backend API will run at:
👉 http://127.0.0.1:8000/


-------------------------------------------
✅ 3. HUGGING FACE MODEL SETUP
-------------------------------------------
Model used:
google/flan-t5-base

No API key needed.
It automatically downloads when used for the first time.
✅ Confirm installation:
python
>>> from transformers import pipeline
>>> llm = pipeline("text2text-generation", model="google/flan-t5-base")
 
-------------------------------------------
✅ 4. FRONTEND SETUP (REACT)
-------------------------------------------
✅ Step 1 — Install Node Modules
Go to task_management_fe folder and run

npm install

✅ Step 2 — Start React App
npm start

React UI will run at:
👉 http://localhost:3000

 
 
