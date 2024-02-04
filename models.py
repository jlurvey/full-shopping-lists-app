from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# Models go here!
class Item(db.Model, SerializerMixin):
    __tablename__ = 'items'

    serialize_rules = ('-notes.item',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    category = db.Column(db.String)
    need = db.Column(db.Boolean, default=True, nullable=False)

    
    notes= db.relationship('Note', back_populates = 'item')
    
    stores = association_proxy('notes', 'store', creator=lambda store_obj: Note(store=store_obj))
    
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
        if need is None:
            raise ValueError("Need is required")
        if not isinstance(need, bool):
            raise ValueError("Need must be a boolean")
        return need        


    def __repr__(self):
        return f'<Item {self.id}, {self.name}, Category: {self.category}, Need: {self.need}>'

class Store(db.Model, SerializerMixin):
    __tablename__ = 'stores'

    serialize_rules = ('-notes.store',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False) 

    notes= db.relationship('Note', back_populates = 'store', cascade='all, delete-orphan')
    
    items = association_proxy('notes', 'item', creator=lambda item_obj: Note(item=item_obj))
    
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

#association model    
class Note(db.Model, SerializerMixin):
    __tablename__ = 'notes'

    serialize_rules = ('-item.reviews','-store.reviews')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String) 
    
    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError("Description is requried")
        if not isinstance(description, str):
            raise ValueError("Description must be a string")
        return description
    
    #fk for item id
    item_id= db.Column(db.Integer, db.ForeignKey('items.id'))
    #fk for store id
    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'))
    
    #relationship mapping note to related item
    item = db.relationship('Item', back_populates='notes')
    #relationship mapping note to related store
    store = db.relationship('Store', back_populates='notes')

    #validation that note does not exist for item and store combination already
    @validates('item_id', 'store_id')
    def validate_combination(self, key, value):
        if key == 'item_id':
            item_id = value
            store_id = self.store_id
        elif key == 'store_id':
            item_id = self.item_id
            store_id = value
        
        existing_note = Note.query.filter_by(item_id=item_id, store_id=store_id).first()
        
        if existing_note and existing_note.id != self.id:
            raise ValueError("Note for this combination of Item and Store already exists")
        
        return value
    
    def __repr__(self):
        return f'<Note {self.id}, Item name: {self.item.name}, Store name: {self.store.name}, {self.description}>'