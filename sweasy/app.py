from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sweasy.db'
db = SQLAlchemy(app)


class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    image_url = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)


@app.route('/')
def index():
    cards = Card.query.all()
    return render_template('index.html', cards=cards)


@app.route('/content')
def get_content():
    return render_template('content_page.html')


if __name__ == '__main__':
    app.run(debug=True)
