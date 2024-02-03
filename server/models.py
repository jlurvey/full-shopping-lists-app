from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    category = db.Column(db.String)
    need = db.Column(db.Boolean)

    #relationship mapping item to related stores
    stores= db.relationship(
        'Store', back_populates = "item", cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Item {self.id}, {self.name}, Category: {self.category}, Need: {self.need}>'

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    #relationship mapping store to related items
    items=db.relationship(
        'Item', back_populates = "store", cascade ='all, delete-orphan')

    def __repr__(self):
        return f'<Store {self.id}, {self.name}>'
    
class Note(db.model, SerializerMixin):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)
    
    def __repr__(self):
        return f'<Note {self.id}, {self.description}>'