from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

app = Flask(__name__)
CORS(app)  # Allowing CORS (for cross container execution)

cart = []

# DEFINE THE DATABASE CREDENTIALS
user = 'storefront'
password = '12345'
host = 'db'
port = 5432
database = 'GamezoneDB'

# Configure PostgreSQL database
app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://{0}:{1}@{2}:{3}/{4}".format(
            user, password, host, port, database
        )
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Avoids a warning

db = SQLAlchemy(app)

class Merch(db.Model):
    __tablename__ = 'merch'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]
    category: Mapped[str]
    price: Mapped[float]
    picture: Mapped[str]
    description: Mapped[str]
    inventory = db.relationship("Inventory", backref="merch", uselist=False)

    def __repr__(self) -> str:
        return f"Merch(name={self.name!r}, price={self.price!r})"

class Inventory(db.Model):
    __tablename__ = 'inventory'
    merch_id: Mapped[int] = mapped_column(db.ForeignKey('merch.id'), primary_key=True)
    quantity: Mapped[int]
    size: Mapped[str] = mapped_column(primary_key=True)

    def __repr__(self) -> str:
        return f"Inventory(merch_id={self.merch_id!r}, quantity={self.quantity!r})"

class Reviews(db.Model):
    __tablename__ = 'reviews'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str]
    rating: Mapped[int]
    review: Mapped[str]
    release_date: Mapped[str]
    review_date: Mapped[str]
    category: Mapped[str]
    link: Mapped[str]

    def __repr__(self) -> str:
        return f"Reviews(title={self.title!r}, rating={self.rating!r})"

@app.route('/items')
def items():
    merch_items = db.session.query(Merch).all()

    merch_list = []
    for item in merch_items:
        # Group all inventory entries for this merch item
        sizes = db.session.query(Inventory).filter_by(merch_id=item.id).all()
        size_list = [{'size': s.size, 'quantity': s.quantity} for s in sizes]

        merch_list.append({
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'picture': item.picture,
            'description': item.description,
            'sizes': size_list  # This is an array of available sizes with quantities
        })

    return jsonify(merch_list)

@app.route('/reviews')
def reviews():
    game_reviews = db.session.execute(db.select(Reviews)).scalars().all()

    # Convert the list of reviews objects into dictionaries
    reviews_list = []
    for review in game_reviews:
        reviews_list.append({
            'id': review.id,
            'title': review.title,
            'rating': review.rating,
            'review': review.review,
            'release_date': review.release_date,
            'review_date': review.review_date,
            'category': review.category,
            'link': review.link
        })

    return jsonify(reviews_list)

@app.route('/cart', methods=['GET', 'POST', 'DELETE'])
def handle_cart():
    if request.method == 'POST':
        item = request.json
        existing_item = next((i for i in cart if i['name'] == item['name'] and i['size'] == item['size']), None)

        if existing_item:
            existing_item['quantity'] += 1
        else:
            item['quantity'] = 1
            cart.append(item)

        return jsonify({'message': 'Item added to cart'}), 201

    elif request.method == 'DELETE':
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

@app.route('/cart/buy', methods=['POST'])
def buy_cart():
    cart_items = request.json.get('cart', [])

    for item_data in cart_items:
        name = item_data['name']
        size = item_data['size']
        quantity = item_data['quantity']

        # Find the merch item
        merch_item = db.session.execute(
            db.select(Merch).where(Merch.name == name)
        ).scalar_one_or_none()

        if merch_item is None:
            return jsonify({'error': f'Item {name} not found'}), 404

        # Find the inventory record matching size
        inventory_record = db.session.execute(
            db.select(Inventory)
            .where(Inventory.merch_id == merch_item.id)
            .where(Inventory.size == size)
        ).scalar_one_or_none()

        if inventory_record is None:
            return jsonify({'error': f'Size {size} for {name} not found'}), 404

        if quantity > inventory_record.quantity:
            return jsonify({'error': f'Not enough stock for {name} size {size}'}), 400

        # Subtract the quantity
        inventory_record.quantity -= quantity

    # Commit all updates
    db.session.commit()
    cart.clear()

    return jsonify({'message': 'Thank you for your purchase!'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

    with app.app_context():
        db.create_all()