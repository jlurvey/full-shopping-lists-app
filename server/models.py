# models.py

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy

from config import db

# CATEGORIES = [{'name': category} for category in ['grocery store', 'hardware store', 'pharmacy', 'convenience store', 'department store']]


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    serialize_rules = ("-notes.item",)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    need = db.Column(db.Boolean, default=True, nullable=False)

    # Foreign key stores Category id
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    # relationship mapping item to related category
    category = db.relationship("Category", back_populates="items")

    # many-to-many relationship with stores through notes
    notes = db.relationship("Note", back_populates="item", cascade="all, delete-orphan")
    stores = association_proxy(
        "notes", "store", creator=lambda store_obj: Note(store=store_obj)
    )

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("item name is required")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("item name must be a non-empty string")
        existing_item = Item.query.filter(
            db.func.lower(Item.name) == db.func.lower(name)
        ).first()
        if existing_item and existing_item.id != self.id:
            raise ValueError("item name already exists")
        return name

    @validates("category_id")
    def validate_category_id(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")
        return value

    @validates("need")
    def validate_need(self, key, need):
        if need is None:
            raise ValueError("need is required")
        if not isinstance(need, bool):
            raise ValueError("need must be a boolean")
        return need

    def __repr__(self):
        return f"<Item {self.id}, {self.name}, Category: {self.category.id}, Need: {self.need}>"


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    # relationship mapping category to related item
    items = db.relationship(
        "Item", back_populates="category", cascade="all, delete-orphan"
    )

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("category name is requried")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("category name must be a non-empty string")
        existing_category = Category.query.filter(
            db.func.lower(Category.name) == db.func.lower(name)
        ).first()
        if existing_category and existing_category.id != self.id:
            raise ValueError("category name already exists")
        return name

    def __repr__(self):
        return f"<Category {self.id}, {self.name}>"


class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    serialize_rules = ("-notes.store",)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)

    notes = db.relationship(
        "Note", back_populates="store", cascade="all, delete-orphan"
    )
    items = association_proxy(
        "notes", "item", creator=lambda item_obj: Note(item=item_obj)
    )

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("store name is requried")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("store name must be a non-empty string")
        existing_store = Store.query.filter(
            db.func.lower(Store.name) == db.func.lower(name)
        ).first()
        if existing_store and existing_store.id != self.id:
            raise ValueError("store name already exists")
        return name

    def __repr__(self):
        return f"<Store {self.id}, {self.name}>"


# association model for items and stores
class Note(db.Model, SerializerMixin):
    __tablename__ = "notes"

    serialize_rules = ("-item.notes", "-store.notes")

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)

    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    item = db.relationship("Item", back_populates="notes")

    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    store = db.relationship("Store", back_populates="notes")

    @validates("description")
    def validate_description(self, key, description):
        if not description:
            raise ValueError("description is required")
        if not isinstance(description, str) or not description.strip():
            raise ValueError("description must be a non-empty string")
        return description

    @validates("item_id", "store_id")
    def validate_ids(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")

        existing_note = Note.query.filter_by(
            item_id=value if key == "item_id" else self.item_id,
            store_id=value if key == "store_id" else self.store_id,
        ).first()
        if existing_note and existing_note.id != self.id:
            raise ValueError(
                "note for this combination of item and store already exists"
            )

        if key == "item_id":
            Item.query.get(value)
        elif key == "store_id":
            Store.query.get(value)

        return value

    def __repr__(self):
        return f"<Note {self.id}, Item: {self.item.id}, Store: {self.store.id}, {self.description}>"