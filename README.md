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
- **Google Colab** for iOS development
- **Ngrok** for iOS development
- **FastAPI** and **SQLAlchemy** for back-end development
- **React Native CLI** for front-end development
- **ChatDoctor** for LLM fine-tuning
- **SQLite** (or another preferred database) for back-end development

### Ngrok Server Setup:

1. Create an ngrok account via:

https://ngrok.com

2. Install ngrok to your local machine:

brew install ngrok

### Initalize the colab environment:

1. Download and open the colab environment from:

Healthcare/Colab_environment.

2. Download the LLM folder from the following shared link to your google drive:

https://drive.google.com/drive/folders/1YHvSY6nsk_cqgC5Opii5hmsX1h6byuE-?usp=sharing

3. Replace wtih your auth-token from ngrok in the 8th cell of colab environment:

!ngrok config add-authtoken "your_authtoken" in the last cell.

4. Run the colab cell from top to bottom and keep the last cell running

### Front-End Setup

1. **Clone the Repository:**

   If you haven’t already, clone the repository using SSH:

   ```bash
   git clone git@github.com:OKSAB/HealthCare.git
   cd HealthCare

   ```

2. Install Node Dependencies:

npm install

3. Create and Activate a Python Virtual Environment:

python -m venv env
source env/bin/activate

4. Install Python Dependencies in the root directory:

pip install -r requirements.txt

### Back-End Setup:

1. Within the created virtual environment keep it activated:

source env/bin/activate # On Windows: env\Scripts\activate

2. Install Python Dependencies in the server directory:

pip install -r requirements.txt

### Application run:

1. Run the colab notebook from top to bottom and copy the ngrok url given from the last cell to chat.py:

NgrokTunnel: "your_ngrok_url.ngrok-free.app" copy to:

chat.py:
response_url="your_ngrok_url.ngrok-free.app/ask" 2. Run the ngrok server tunnel on a different terminal tab:

ngrok http http://127.0.0.1:8000

3. Replace the ngrok link given to Healthcare/config.js:

api:'your_ngrok_url.ngrok-free.app'

4. Run the colab notebook and copy the ngrok url given from the last cell to chat.py:

NgrokTunnel: "your_ngrok_url.ngrok-free.app" copy to:

chat.py:
response_url="your_ngrok_url.ngrok-free.app/ask"

5. Run the server uvicorn server on a different terminal tab from the directory Healthcare/server:

uvicorn app:app --reload

6. Open a simulator:

open -a simulator

7. Run the npm start command on your terminal:

npm start react-native

### CI/CD Pipeline:

The project includes a GitHub Actions pipeline configured in .github/workflows/ci.yml. The pipeline automatically runs linting, tests, and builds the project when code is pushed to or a pull request is made against the main branch.

### Usage:

- Sign Up & Sign In:
  New users register via the SignUpScreen. Existing users sign in through the SignInScreen. Successful authentication redirects to the Dashboard.

- Profile Management:
  Users can view and edit their profile (email, first name, last name, DOB, height, weight) in the ProfileScreen.

- Chat History:
  The HistoryScreen displays past chats. Users can view, rename, or delete previous conversations.

npm react-native start --reset-cache

- Backend Connection Issues:
  Confirm that your FastAPI server is running on the correct host/port (default: http://127.0.0.1:8000) and that the mobile app is configured to use this endpoint.

- CI/CD Failures:
  Check the GitHub Actions workflow logs for errors, and verify that your test and lint scripts are set up in package.json.
