from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Add this line to allow the frontend to access the API
cart = []

# Get or add shopping cart items
@app.route('/cart', methods=['GET', 'POST', 'DELETE'])
def handle_cart():
    if request.method == 'POST':
        item = request.json
        cart.append(item)
        return jsonify({'message': 'Item added to cart'}), 201
    
    elif request.method == 'DELETE':
        cart.clear()
        return jsonify({'message': 'Cart cleared'}), 200
    
    return jsonify(cart)

# Delete a single item from the shopping cart by index.
@app.route('/cart/<int:index>', methods=['DELETE'])
def delete_item(index):
    if 0 <= index < len(cart):
        removed_item = cart.pop(index)
        return jsonify({'message': 'Item removed', 'item': removed_item}), 200
    return jsonify({'error': 'Invalid index'}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
