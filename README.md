# H A V E N
## Overview

This repository contains the source code of H A V E N. Our AI driven hotel search platform:
- It is build with a [React.JS](https://react.dev/) frontend,
- The backend uses Python's [FastAPI](https://fastapi.tiangolo.com/) framework,
- It uses the [speechmatics](https://www.speechmatics.com/) API for transcription,
- It uses [Google's Gemini](https://deepmind.google/technologies/gemini/) and [LangChain](https://www.langchain.com/) for LLMs.
 
## Requirements

Use the following tools to set up the project:
- [Node.js](https://nodejs.org/) v20.18.0+
- [npm](https://www.npmjs.com/) v11.0.0
- [Python](https://www.python.org/) v3.11+

## Run locally

1. Clone the repository

```bash
    git clone https://github.com/cs7-shrey/voyagerhack/
``` 

2. Navigate to the project directory.

```bash
    cd voyagerhack
```

3. Install all website dependencies. 

```bash
    npm install
    pip install -r requirements.txt
```

4. Create a .env file with the following environment variables
```bash
    DATABASE_URL,
    ORM_URL,
    GOOGLE_API_KEY,
    SPEECHMATICS_API_KEY,
    TAVILY_API_KEY,
    MAPS_API_KEY,

    ALGORITHM,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    SECRET_KEY,
    ENVIRONMENT,

    VITE_SOCKET_BASE_URL,
    VITE_HTTP_BASE_URL,

    BASE_FRONTEND_DOMAIN,
    BASE_FRONTEND_URL
```

5. Run the backend server
```bash
    uvicorn app.main:app
```

6. Run the frotnend
```bash
    npm run dev
```
```text
├── app                                         # The backend code
    │   ├── routes                              # Backend API routes
    │   ├── services                            # Core services used by the backend
    │   │   ├── ai                              # LLM services used by the backend
    │   │   ├── crud                            # DB crud service for backend
    │   │   └── tools                           # Tool declarations and definitions for Agents
    │   └── utils                               # Utilities
    ├── public                                  # Static data for frontend
    ├── src                                     # React frontend code
    │   ├── assets                              # Various assets
    │   ├── components                          # Frontend components
    │   ├── context                             # Custom context layer
    │   ├── lib                                 # Client logic for audio/websocket connections
    │   ├── routes                              # Routes for client side routing
    │   └── store                               # Zustand state store
    └── .github                                 # Definitions of GitHub workflows

```