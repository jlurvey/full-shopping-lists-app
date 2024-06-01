# models.py

from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
import re

from config import db, bcrypt


class User(db.Model, SerializerMixin):
    __tablename__ = "users"
    
    serialize_rules = (
        "-categories", "-items", "-stores", "-notes"
    )

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)

    items = db.relationship("Item", back_populates="user", cascade="all, delete-orphan")
    categories = db.relationship("Category", back_populates="user", cascade="all, delete-orphan")
    stores = db.relationship("Store", back_populates="user", cascade="all, delete-orphan")
    notes = db.relationship("Note", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        raise AttributeError("Password is not a readable attribute")

    @password.setter
    def password(self, password):
        if not password:
            raise ValueError("Password is required")
        self._password_hash = bcrypt.generate_password_hash(password).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode("utf-8"))

    @validates("email")
    def validate_email(self, key, email):
        if not email:
            raise ValueError("Email is required")
        email_regex = r"^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b"
        if not re.match(email_regex, email):
            raise ValueError("Invalid email format")
        existing_user = User.query.filter(
            db.func.lower(User.email) == db.func.lower(email)
        ).first()
        if existing_user and existing_user.id != self.id:
            raise ValueError("email already exists")
        return email

    def __repr__(self):
        return f"<User {self.id}, {self.email}>"


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    serialize_rules = ("-notes.item", "-categories.item", "-user")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    need = db.Column(db.Boolean, default=True, nullable=False)

    # Foreign key stores Category id
    category_id = db.Column(db.Integer, db.ForeignKey("categories.id"), nullable=False)
    # relationship mapping item to related category
    category = db.relationship("Category", back_populates="items")

    # Foreign key stores User id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # Relationship mapping item to related user
    user = db.relationship("User", back_populates="items")

    # many-to-many relationship with stores through notes
    notes = db.relationship("Note", back_populates="item", cascade="all, delete-orphan")
    stores = association_proxy("notes", "store", creator=lambda store_obj: Note(store=store_obj))

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("item name is required")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("item name must be a non-empty string")
        return name

    @validates("category_id")
    def validate_category_id(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")
        return value

    @validates("user_id")
    def validate_user_id(self, key, value):
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
        return f"<Item {self.id}, {self.name}, Category: {self.category.id}, Need: {self.need}, User: {self.user.id}>"


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    serialize_rules = ("-items", "-user")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    # relationship mapping category to related item
    items = db.relationship("Item", back_populates="category", cascade="all, delete-orphan")

    # Foreign key stores User id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # Relationship mapping item to related user
    user = db.relationship("User", back_populates="categories")
    
    @validates("user_id")
    def validate_user_id(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")
        return value

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("category name is requried")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("category name must be a non-empty string")
        return name

    def __repr__(self):
        return f"<Category {self.id}, {self.name}, User: {self.user.id}>"


class Store(db.Model, SerializerMixin):
    __tablename__ = "stores"

    serialize_rules = ("-notes.store", "-user")

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)

    notes = db.relationship("Note", back_populates="store", cascade="all, delete-orphan")
    items = association_proxy("notes", "item", creator=lambda item_obj: Note(item=item_obj))

    # Foreign key stores User id
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    # Relationship mapping item to related user
    user = db.relationship("User", back_populates="stores")

    @validates("name")
    def validate_name(self, key, name):
        if not name:
            raise ValueError("store name is requried")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("store name must be a non-empty string")
        return name

    @validates("user_id")
    def validate_user_id(self, key, value):
        if value is None:
            raise ValueError(f"{key} is required")
        elif not isinstance(value, int):
            raise ValueError(f"{key} must be an integer")
        return value

    def __repr__(self):
        return f"<Store {self.id}, {self.name}, User: {self.user.id}>"


# association model for items and stores
class Note(db.Model, SerializerMixin):
    __tablename__ = "notes"

    serialize_rules = ("-item.notes", "-store.notes", "-user")

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String)

    item_id = db.Column(db.Integer, db.ForeignKey("items.id"), nullable=False)
    item = db.relationship("Item", back_populates="notes")

    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), nullable=False)
    store = db.relationship("Store", back_populates="notes")
    
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    user = db.relationship("User", back_populates="notes")

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
        return value

    def __repr__(self):
        return f"<Note {self.id}, Item: {self.item.id}, Store: {self.store.id}, {self.description}>"
