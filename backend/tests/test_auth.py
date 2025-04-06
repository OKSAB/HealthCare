import pytest
from fastapi.testclient import TestClient
from ..main import app

client = TestClient(app)

def test_signup_and_signin():
    # sign up
    response = client.post("/signup", json={
        "email": "tester@example.com",
        "password": "TestPassword123",
        "first_name": "John",
        "last_name": "Doe"
    })
    assert response.status_code == 201
    assert response.json()["message"] == "User created successfully."

    # sign in
    response = client.post("/signin", json={
        "email": "tester@example.com",
        "password": "TestPassword123"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "Sign in successful!"
