from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False) #needs validation
    category = db.Column(db.String) #needs validation
    need = db.Column(db.Boolean) #needs validation

    #relationship mapping item to related stores
    stores= db.relationship(
        'Store', back_populates = 'item', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Item {self.id}, {self.name}, Category: {self.category}, Need: {self.need}>'

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False) #needs validation

    #relationship mapping store to related items
    items=db.relationship(
        'Item', back_populates = 'store', cascade ='all, delete-orphan')

    def __repr__(self):
        return f'<Store {self.id}, {self.name}>'
    
class Note(db.Model, SerializerMixin):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String) #needs validation

    #fk for item id
    item_id= db.Column(db.Integer, db.ForeignKey('items.id'))
    #fk for store id
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    
    #relationship mapping note to related item
    item = db.relationship('Item', back_populates='notes')

    #relationship mapping note to related store
    store = db.relationship('Store', back_populates='notes')

    def __repr__(self):
        return f'<Note {self.id}, Item name: {self.item.name}, Store name: {self.store.name}, {self.description}>' 