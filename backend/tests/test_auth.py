from fastapi.testclient import TestClient
from backend.main import app
import uuid

client = TestClient(app)

def test_signup_and_signin():
    unique_email = f"tester_{uuid.uuid4().hex}@example.com"

    response = client.post("/signup", json={
        "email": unique_email,
        "password": "TestPassword123",
        "first_name": "John",
        "last_name": "Doe",
        "dob": "1990-01-01",
        "height": "5.9 ft",
        "weight": "70 kg"
    })

    print("RESPONSE:", response.status_code, response.json())
    assert response.status_code == 201
    assert response.json()["message"] == "User created successfully"
