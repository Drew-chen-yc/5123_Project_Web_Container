from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

app = Flask(__name__)
CORS(app)  # Allowing CORS (for cross container execution)

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
    price: Mapped[float]
    picture: Mapped[str]
    inventory = db.relationship("Inventory", backref="merch", uselist=False)

    def __repr__(self) -> str:
        return f"Merch(name={self.name!r}, price={self.price!r})"

class Inventory(db.Model):
    __tablename__ = 'inventory'
    merch_id: Mapped[int] = mapped_column(db.ForeignKey('merch.id'), primary_key=True)
    quantity: Mapped[int]

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

    def __repr__(self) -> str:
        return f"Reviews(title={self.title!r}, rating={self.rating!r})"

@app.route('/items')
def items():
    merch = db.session.query(Merch).join(Merch.inventory).all()

    # Convert the list of Merch objects into dictionaries
    merch_list = []
    for item in merch:
        merch_list.append({
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'picture': item.picture,
            'quantity' : item.inventory.quantity
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
            'review_date': review.review_date
        })

    return jsonify(reviews_list)

@app.route('/cart/buy', methods=['POST'])
def buy_cart():
    cart_items = request.json.get('cart', [])

    for item_data in cart_items:
        name = item_data['name']
        in_cart = item_data['inCart']

        # Get the item from the database
        merch_item = db.session.execute(
            db.select(Merch).where(Merch.name == name)
        ).scalar_one_or_none()

        if merch_item is None:
            return jsonify({'error': f'Item {name} not found'}), 404

        if in_cart > merch_item.inventory.quantity:
            return jsonify({'error': f'Not enough stock for {name}'}), 400

        # Subtract quantity
        merch_item.inventory.quantity -= in_cart

    # Commit the updates to the database
    db.session.commit()

    return jsonify({'message': 'Thank you for your purchase!'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

    with app.app_context():
        db.create_all()