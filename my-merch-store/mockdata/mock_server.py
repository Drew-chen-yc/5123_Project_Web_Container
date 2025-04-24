from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allowing CORS (for cross container exercution)

@app.route('/items')
def items():
    return jsonify([
        {"name": "T-Shirt", "price": 20},
        {"name": "Hat", "price": 10},
        {"name": "Sticker", "price": 2}
    ])

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)