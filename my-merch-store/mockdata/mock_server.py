from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allowing CORS (for cross container execution)

@app.route('/items')
def items():
    return jsonify([
        {"name": "T-Shirt", "price": 20, "image": "http://localhost:5001/static/images/p1.png"}, 
        {"name": "Hat", "price": 10, "image": "http://localhost:5001/static/images/p2.png"}, 
        {"name": "Sticker", "price": 2, "image": "http://localhost:5001/static/images/p3.png"}
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
