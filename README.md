# NIT-J AI Assistant

Full-stack RAG web app for NIT Jalandhar. Students ask questions in natural language and receive answers grounded in uploaded college documents, with source document names and page citations.

## Stack

- React 18 + Vite + Tailwind CSS
- Node.js + Express
- MongoDB + Mongoose
- JWT auth with bcrypt password hashing
- Python scripts invoked from Express with `child_process.spawn`
- ChromaDB local persistent vector store
- Hugging Face Inference API for embeddings and Mistral answer generation

## Setup

Install frontend packages:

```bash
cd frontend
npm install
```

Install backend packages:

```bash
cd backend
npm install
```

Install Python packages:

```bash
cd backend/python
pip install -r requirements.txt
```

Create environment files:

```bash
cp backend/.env.example backend/.env
cp backend/python/.env.example backend/python/.env
```

Update `backend/.env` with MongoDB and JWT settings. Update `backend/python/.env` with your Hugging Face API key.

## Run

Start MongoDB locally, then run:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

If PowerShell blocks `npm` with a script execution policy message, use `npm.cmd` for the same commands.

Open `http://localhost:5173`.

## Admin Users

Student accounts can register from the app. Admin accounts should be created or promoted directly in MongoDB by setting `role` to `admin`.

## API Shape

Successful responses use:

```json
{ "success": true, "data": {} }
```

Errors use:

```json
{ "success": false, "message": "Readable error" }
```
