//FLASK 
pip install flask flask-cors flask_sqlalchemy flask_bcrypt flask_jwt_extended pandas

//server.py
from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import pandas as pd

app = Flask(__name__)
app.secret_key = "your_secret_key"
CORS(app, supports_credentials=True)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///users.db"
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(username=data["username"]).first()
    if user and bcrypt.check_password_hash(user.password_hash, data["password"]):
        session["user"] = user.username
        return jsonify({"success": True})
    return jsonify({"success": False}), 401

@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user", None)
    return jsonify({"success": True})

@app.route("/check-auth", methods=["GET"])
def check_auth():
    return jsonify({"authenticated": "user" in session})

@app.route("/data", methods=["GET"])
def get_data():
    df = pd.read_csv("D:/R_Dataset/fraudtest.csv")
    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
