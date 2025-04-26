from flask import Flask, jsonify, request, redirect
from flask_cors import CORS
from flask_sqlalchemy  import SQLAlchemy
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

app = Flask(__name__)
CORS(app)  # Allowing CORS (for cross container execution)

# DEFINE THE DATABASE CREDENTIALS
user = 'storefront'
password = '12345'
host = 'localhost'
port = 5432
database = 'MerchDB'

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

    def __repr__(self) -> str:
        return f"Merch(name={self.name!r}, price={self.price!r})"

@app.route('/items')
def items():
    merch = db.session.execute(db.select(Merch)).scalars().all()

    # Convert the list of Merch objects into dictionaries
    merch_list = []
    for item in merch:
        merch_list.append({
            'id': item.id,
            'name': item.name,
            'price': item.price,
            'picture': item.picture
        })

    return jsonify(merch_list)



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

    with app.app_context():
        db.create_all()