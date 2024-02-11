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

    notes= db.relationship('Note', back_populates = 'item', cascade='all, delete-orphan')
    
    stores = association_proxy('notes', 'store', creator=lambda store_obj: Note(store=store_obj))
    
    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Name is required")
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
        existing_store = Store.query.filter(db.func.lower(Store.name) == db.func.lower(name)).first()
        if existing_store and existing_store.id != self.id:
            raise ValueError("Name already exists")
        return name

    def __repr__(self):
        return f'<Store {self.id}, {self.name}>'

#association model    
class Note(db.Model, SerializerMixin):
    __tablename__ = 'notes'

    #serialize_rules = ('-item.notes','-store.notes')

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String) 

    item_id = db.Column(db.Integer, db.ForeignKey('items.id'),nullable = False)
    item = db.relationship('Item', back_populates='notes')

    store_id = db.Column(db.Integer, db.ForeignKey('stores.id'),nullable = False)
    store = db.relationship('Store', back_populates='notes')

    
    @validates('description')
    def validate_description(self, key, description):
        if not description:
            raise ValueError("Description is required")
        if not isinstance(description, str):
            raise ValueError("Description must be a string")
        return description

    @validates('item_id', 'store_id')
    def validate_ids(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")
        
        if self.id is not None:
            existing_note = Note.query.filter_by(item_id=self.item_id, store_id=self.store_id).first()
            if existing_note and existing_note.id != self.id:
                raise ValueError("Note for this combination of Item and Store already exists")
        
        if key == 'item_id':
            Item.query.get(value)
        elif key == 'store_id':
            Store.query.get(value)

        return value
        
    def __repr__(self):
        return f'<Note {self.id}, Item: {self.item.id}, Store: {self.store.id}, {self.description}>'