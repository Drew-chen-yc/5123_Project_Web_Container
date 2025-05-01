from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

cart = []

@app.route('/cart', methods=['GET', 'POST', 'DELETE'])
def handle_cart():
    if request.method == 'POST':
        item = request.json
        existing_item = next((i for i in cart if i['name'] == item['name']), None)
        if existing_item:
            existing_item['inCart'] += 1
        else:
            item['inCart'] = 1
            cart.append(item)
        return jsonify({'message': 'Item added to cart'}), 201

    elif request.method == 'DELETE':
        item = request.json
        item['inCart'] = 0
        cart.clear()
        return jsonify({'message': 'Cart cleared'}), 200

    return jsonify(cart)

@app.route('/cart/update', methods=['POST'])
def update_quantity():
    data = request.json
    name = data['name']
    price = data['price']
    change = data['change']

    item = next((i for i in cart if i['name'] == name), None)

    if item:
        item['inCart'] += change
        if item['inCart'] <= 0:
            cart.remove(item)
        return jsonify({'message': 'Quantity updated', 'item': item}), 200
    elif change > 0:
        cart.append({'name': name, 'price': price, 'inCart': change})
        return jsonify({'message': 'New item added', 'item': name}), 201
    else:
        return jsonify({'error': 'Item not found'}), 404

@app.route('/cart/clear', methods=['POST'])
def clear_cart():
    cart.clear()
    return jsonify({'message': 'Cart cleared'}), 200

@app.route('/purchase', methods=['POST'])
def purchase():
    posted_cart = request.json.get('cart', [])
    response = requests.post('http://mockdata:5001/cart/buy', json={'cart': posted_cart})
    cart.clear()
    return response.json(), response.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
