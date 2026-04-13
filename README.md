# Hi, I'm L.T.Hung

I'm working on a web development project. Here's what I used in this project (You can check the project structure below)

# Project structure: blackbidz

**Generated:** 4/13/2026, 6:10:56 AM
**Root Path:** `/home/blackbi/blackbidz`

```
├── .github
│   └── workflows
│       └── sync_to_hf.yml
├── backend
│   ├── routers
│   │   ├── blogs.py
│   │   ├── music_reviews.py
│   │   └── uploads.py
│   ├── Dockerfile
│   ├── README.md
│   ├── database.py
│   ├── init_db.py
│   ├── main.py
│   ├── migrate_data.py
│   ├── models.py
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── schemas.py
│   └── uv.lock
├── public
│   ├── blogs
│   │   └── 1775985563_1_lth_first_blog.jpg
│   ├── fonts
│   │   └── TAN-Mon-Cheri.otf
│   ├── music_reviews
│   │   ├── 1776001366_cai_thu_hai.jpg
│   │   └── 1776002956_darangto.jpg
│   ├── LTH_CV.pdf
│   └── vite.svg
├── src
│   ├── assets
│   │   ├── logo.png
│   │   ├── lth.png
│   │   └── react.svg
│   ├── components
│   │   ├── AdminPanel.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Blogs.tsx
│   │   ├── CreateMusicReview.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Loader.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── MusicEvaluations.css
│   │   ├── MusicEvaluations.tsx
│   │   ├── MusicReviewCard.tsx
│   │   └── NavBar.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```

---
## Tech stack
- Frontend: **React**, deployed on **Vercel**
- Backend: **FastAPI**, deployed on **HuggingFace**
- Data: Using **Supabase** for storing tabular data, and **Cloudinary** to store images and videos.

## How to use on your local computer
This is a bit tricky, so follow through
### Adding the Environment Variables
Of course I would not show you the `.env` file in my project. There are just three env variables in my projects: one is for the API, the rest is for the clouds. It goes like this:
```
VITE_API_URL = 
DATABASE_URL=
CLOUDINARY_URL=
```
For the API url, you can set at your localhost, which is `http://localhost:8000`. For the other, you must go to the websites and get the API key for yourself, that requires a bit of effort. 
### Running the backend
You must start the server, but it's not easy, because I use `uv` and it's like a subproject in the folder `backend`.

First you'll need to move to the `backend` folder
```
cd backend
```
Remember to inititalize the project and add all of the libraries.
```
uv init
uv pip install requirements.txt
```
Then, you must add the Python Path for the parent directory,because I use the folder `backend` as the module, and when deploying on HuggingFace I set it as a subfolder, so we must tell the terminal to get back at the parent dir, but running code at the subdir. It's complicated, so just copy and paste the code.
```
export PYTHONPATH=$PYTHONPATH:..
```
Then we start the server
```
uv run uvicorn backend.main:app --reload
```
### Showing the frontend
Now you should open a new terminal, and make sure that it's on the parent directory (not `backend` anymore).

Run this
```
npm run dev
```
You should get a website at your `localhost`, and that's it. Feel free to play around.