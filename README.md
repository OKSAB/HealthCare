# HealthCare

**ChatDoctor: A Medical Chat Model Fine-tuned on LLaMA Model using Medical Domain Knowledge**

ChatDoctor is a fine-tuned large language model (LLM) built for answering medical enquiries with natural remedies. The model has been fine-tuned using resources available on Hugging Face along with system prompt engineering to ensure that responses focus exclusively on natural remedies.

## Authors & Affiliations

- **Yunxiang Li** – University of Texas Southwestern Medical Center, Dallas, USA
- **Zihan Li** – University of Illinois at Urbana-Champaign, Urbana, USA
- **Kai Zhang** – Ohio State University, Columbus, USA
- **Ruilong Dan** – Hangzhou Dianzi University, Hangzhou, China
- **You Zhang** – University of Texas Southwestern Medical Center, Dallas, USA

## Overview

HealthCare integrates a React Native iOS application with a FastAPI back-end to provide users with a secure and user-friendly interface. Users can sign up, sign in, manage their profile, and view their chat history. The ChatDoctor LLM is used to answer medical queries by providing advice on natural remedies.

## Features

- **Medical Inquiry Assistance:**  
  Leverages ChatDoctor to answer medical enquiries with natural remedies.
- **User Authentication:**  
  Secure sign-up and sign-in processes with encrypted password storage.
- **Profile Management:**  
  Users can view and edit their profile details (first name, last name, DOB, height, weight, and email).
- **Chat History:**  
  Conversations are saved, and users can revisit, rename, or delete past chats similar to ChatGPT.
- **CI/CD Pipeline:**  
  A GitHub Actions workflow automates linting, testing, and building of the project.

## Project Structure

HealthCare/ ├── .github/ │ └── workflows/ │ └── ci.yml # CI/CD configuration using GitHub Actions ├── Images/ # Contains custom SVG assets (e.g. person.svg, send.svg) ├── src/ │ ├── context/ │ │ └── AuthContext.tsx # Global authentication context │ ├── screens/ │ │ ├── IntroScreen.tsx # App introduction screen │ │ ├── SignInScreen.tsx # Sign-in screen for existing users │ │ ├── SignUpScreen.tsx # Sign-up screen for new users │ │ ├── DashboardScreen.tsx # Chat interface screen │ │ ├── ProfileScreen.tsx # User profile management screen │ │ └── HistoryScreen.tsx # Chat history screen │ ├── App.tsx # Main app component with navigation and context │ └── ... # Other components and utilities ├── backend/ │ ├── main.py # FastAPI application entry point │ ├── models.py # SQLAlchemy models (User, Chat, etc.) │ └── database.py # Database connection and session setup ├── metro.config.js # Metro configuration (SVG transformer, etc.) ├── svg.d.ts # Type declarations for SVG imports ├── package.json # Node project configuration ├── README.md # This file └── ... # Other configuration files (e.g., .gitignore, CI files)

## Technologies Used

- **Front-End:** React Native, TypeScript, Metro Bundler
- **Back-End:** FastAPI, SQLAlchemy, SQLite (or another preferred database)
- **LLM Fine-Tuning:** ChatDoctor fine-tuned on the LLaMA model using medical domain data
- **CI/CD:** GitHub Actions
- **Assets:** Custom SVG icons for profile and send buttons, managed via react-native-svg and configured with react-native-svg-transformer

## Setup & Installation

### Prerequisites

- **Node.js** (v18 or above) and npm/yarn
- **Python** (v3.10+ recommended)
- **Git** for version control
- **Xcode** for iOS development

### Front-End Setup

1. **Clone the Repository:**

   If you haven’t already, clone the repository using SSH:

   ```bash
   git clone git@github.com:OKSAB/HealthCare.git
   cd HealthCare

   ```

2. Install Node Dependencies:

npm install

# or

yarn install

3. Configure Metro for SVGs:

Ensure you have a properly configured metro.config.js (see our repository) and a svg.d.ts file to support SVG imports.

4. Start the Metro Server:

npm start

# or

yarn start

5. Run the iOS App: In a new terminal window:

npm start react-native

### Back-End Setup:

1. Create and Activate a Python Virtual Environment:

python -m venv env
source env/bin/activate # On Windows: env\Scripts\activate

2. Install Python Dependencies:

pip install -r requirements.txt

3. Run the FastAPI Application: Navigate to the backend directory and run:

uvicorn main:app --host 0.0.0.0 --port 8000 --reload

### CI/CD Pipeline:

The project includes a GitHub Actions pipeline configured in .github/workflows/ci.yml. The pipeline automatically runs linting, tests, and builds the project when code is pushed to or a pull request is made against the main branch.

### Usage:

- Sign Up & Sign In:
  New users register via the SignUpScreen. Existing users sign in through the SignInScreen. Successful authentication redirects to the Dashboard.

- Profile Management:
  Users can view and edit their profile (email, first name, last name, DOB, height, weight) in the ProfileScreen.

- Chat History:
  The HistoryScreen displays past chats. Users can view, rename, or delete previous conversations.

### Troubleshooting:

- SVG Rendering Issues:
  Ensure that react-native-svg and react-native-svg-transformer are installed and configured properly. Clear Metro’s cache with:

npx react-native start --reset-cache

- Backend Connection Issues:
  Confirm that your FastAPI server is running on the correct host/port (default: http://127.0.0.1:8000) and that the mobile app is configured to use this endpoint.

- CI/CD Failures:
  Check the GitHub Actions workflow logs for errors, and verify that your test and lint scripts are set up in package.json.
