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
    need = db.Column(db.Boolean, default=True, nullable=False) #needs validation

    #relationship mapping item to related stores
    stores= db.relationship(
        'Store', back_populates = 'item', cascade='all, delete-orphan')
    
    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name is requried")
        if not isinstance(name, str):
            raise ValueError("Name must be a string")
        existing_item = Item.query.filter(db.func.lower(Item.name) == db.func.lower(name)).first()
        if existing_item and existing_item.id != self.id:
            raise ValueError("Name already exists")
        return name
    
    @validates('need')
    def validate_need(self, key, need):
        if not need:
            raise ValueError("Need is required")
        if not isinstance(need, bool):
            raise ValueError("Need must be a boolean")
        return need        


    def __repr__(self):
        return f'<Item {self.id}, {self.name}, Category: {self.category}, Need: {self.need}>'

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False) #needs validation

    #relationship mapping store to related items
    items=db.relationship(
        'Item', back_populates = 'store', cascade ='all, delete-orphan')
    
    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name is requried")
        if not isinstance(name, str):
            raise ValueError("Name must be a string")
        existing_item = Item.query.filter(db.func.lower(Item.name) == db.func.lower(name)).first()
        if existing_item and existing_item.id != self.id:
            raise ValueError("Name already exists")
        return name

    def __repr__(self):
        return f'<Store {self.id}, {self.name}>'
    
class Note(db.Model, SerializerMixin):
    __tablename__ = 'notes'

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String) #needs validation
    
    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError("Description is requried")
        if not isinstance(description, str):
            raise ValueError("Description must be a string")
        existing_item = Item.query.filter(db.func.lower(Item.description) == db.func.lower(description)).first()
        if existing_item and existing_item.id != self.id:
            raise ValueError("Description already exists")
        return description
    
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