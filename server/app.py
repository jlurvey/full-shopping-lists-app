# app.py
#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import jsonify, make_response, request, session
from flask_restful import Resource
from werkzeug.exceptions import BadRequest, HTTPException, NotFound, Unauthorized, Forbidden, UnprocessableEntity
from sqlalchemy import func

# Local imports
from config import app, db, api

# Add your model imports
from models import Item, Store, Note, Category, User


# Views go here!
@app.route("/")
def index():
    return "<h1>Project Server</h1>"


class Signup(Resource):
    def post(self):
        data = request.get_json()
        try:
            new_user = User(email=data["email"], password=data["password"])
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)
        

class CheckSession(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id:
            user = User.query.filter(User.id == user_id).first()
            return make_response(jsonify(user.to_dict()), 200)
        
        
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter(User.email == data["email"]).first()
        password = data["password"]
        try:
            if user and user.check_password(password):
                session["user_id"] = user.id
                return make_response(user.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class Logout(Resource):
    def delete(self):
        user_id = session.get("user_id")
        if user_id is not None:
            session["user_id"] = None
        try:
            if user_id is not None:
                session["user_id"] = None
            make_response("", 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)
    

class ItemIndex(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id is None:
            raise Unauthorized("Unauthorized")
        items = [item.to_dict() for item in Item.query.filter_by(user_id=user_id).order_by(Item.name).all()]
        return make_response(jsonify(items), 200)

    def post(self):
        user_id = session.get("user_id")
        data = request.get_json()
        check_name_exist(Item, data["name"], user_id)
        check_id(Category, data["category_id"], user_id)
        try:
            new_item = Item(
                name=data["name"],
                category_id=data["category_id"],
                need=data["need"],
                user_id=user_id
            )
            db.session.add(new_item)
            db.session.commit()
            return make_response(new_item.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class ItemById(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        item = check_id(Item, id, user_id)
        if item:
            return make_response(item.to_dict(), 200)

    def patch(self, id):
        user_id = session.get("user_id")
        data = request.get_json()
        item = check_id(Item, id, user_id)
        check_name_exist(Item, data["name"], user_id)
        check_id(Category, data["category_id"], user_id)
        try:
            for attr in data:
                setattr(item, attr, data[attr])
            db.session.add(item)
            db.session.commit()
            return make_response(item.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)

    def delete(self, id):
        user_id = session.get("user_id")
        item = check_id(Item, id, user_id)
        try:
            db.session.delete(item)
            db.session.commit()
            make_response("", 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class CategoryIndex(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id is None:
            raise Unauthorized("Unauthorized")
        categories = [category.to_dict() for category in Category.query.filter_by(user_id=user_id).order_by(Category.name).all()]
        return make_response(jsonify(categories), 200)

    def post(self):
        user_id = session.get("user_id")
        data = request.get_json()
        check_name_exist(Category, data["name"], user_id)
        try:
            new_category = Category(name=data["name"],user_id=user_id)
            db.session.add(new_category)
            db.session.commit()
            return make_response(new_category.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class CategoryById(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        category = check_id(Category, id, user_id)
        if category:
            return make_response(category.to_dict(), 200)

    def patch(self, id):
        user_id = session.get("user_id")
        data = request.get_json()
        category = check_id(Category, id, user_id)
        check_name_exist(Category, data["name"], user_id)
        try:
            for attr in data:
                setattr(category, attr, data[attr])
            db.session.add(category)
            db.session.commit()
            return make_response(category.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)

    def delete(self, id):
        user_id = session.get("user_id")
        category = check_id(Category, id, user_id)
        try:
            db.session.delete(category)
            db.session.commit()
            return make_response("", 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class StoreIndex(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id is None:
            raise Unauthorized("Unauthorized")
        stores = [store.to_dict() for store in Store.query.filter_by(user_id=user_id).order_by(Store.name).all()]
        return make_response(jsonify(stores), 200)

    def post(self):
        user_id = session.get("user_id")
        data = request.get_json()
        check_name_exist(Store, data["name"], user_id)
        try:
            new_store = Store(name=data["name"], user_id=user_id)
            db.session.add(new_store)
            db.session.commit()
            return make_response(new_store.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class StoreById(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        store = check_id(Store, id, user_id)
        if store:
            return make_response(store.to_dict(), 200)

    def patch(self, id):
        user_id = session.get("user_id")
        data = request.get_json()
        store = check_id(Store, id, user_id)
        check_name_exist(Store, data["name"], user_id)
        try:
            for attr in data:
                setattr(store, attr, data[attr])
            db.session.add(store)
            db.session.commit()
            return make_response(store.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)

    def delete(self, id):
        user_id = session.get("user_id")
        store = check_id(Store, id, user_id)
        try:
            db.session.delete(store)
            db.session.commit()
            return make_response("", 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class NoteIndex(Resource):
    def get(self):
        user_id = session.get("user_id")
        if user_id is None:
            raise Unauthorized("Unauthorized")
        notes = [note.to_dict() for note in Note.query.filter_by(user_id=user_id).all()]
        return make_response(jsonify(notes), 200)

    def post(self):
        user_id = session.get("user_id")
        data = request.get_json()
        check_id(Item, data["item_id"], user_id)
        check_id(Store, data["store_id"], user_id)
        existing_note = Note.query.filter_by(
            item_id=data["item_id"],
            store_id=data["store_id"],
            user_id=user_id
        ).first()
        if existing_note:
            raise UnprocessableEntity(f"Note '{existing_note.id}' already exists for Item '{existing_note.item_id}' and Store '{existing_note.store_id}'")
        try:
            new_note = Note(
                description=data["description"],
                item_id=data["item_id"],
                store_id=data["store_id"],
                user_id=user_id
            )
            db.session.add(new_note)
            db.session.commit()
            return make_response(new_note.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class NoteById(Resource):
    def get(self, id):
        user_id = session.get("user_id")
        note = check_id(Note, id, user_id)
        if note:
            return make_response(note.to_dict(), 200)

    def patch(self, id):
        user_id = session.get("user_id")
        data = request.get_json()
        note = check_id(Note, id, user_id)
        check_id(Item, data["item_id"], user_id)
        check_id(Store, data["store_id"], user_id)
        existing_note = Note.query.filter_by(
            item_id=data["item_id"],
            store_id=data["store_id"],
            user_id=user_id
        ).first()
        if existing_note:
            raise UnprocessableEntity(f"Note '{existing_note.id}' already exists for Item '{existing_note.item_id}' and Store '{existing_note.store_id}'")
        try:
            for attr in data:
                setattr(note, attr, data[attr])
            db.session.add(note)
            db.session.commit()
            return make_response(note.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)

    def delete(self, id):
        user_id = session.get("user_id")
        note = check_id(Note, id, user_id)
        try:
            db.session.delete(note)
            db.session.commit()
            return make_response("", 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


api.add_resource(Signup, "/signup", endpoint = "signup")
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(ItemIndex, "/items", endpoint="items")
api.add_resource(ItemById, "/items/<int:id>", endpoint="items/<int:id>")
api.add_resource(StoreIndex, "/stores", endpoint="stores")
api.add_resource(StoreById, "/stores/<int:id>", endpoint="stores/<int:id>")
api.add_resource(NoteIndex, "/notes", endpoint="notes")
api.add_resource(NoteById, "/notes/<int:id>", endpoint="notes/<int:id>")
api.add_resource(CategoryIndex, "/categories", endpoint="categories")
api.add_resource(CategoryById, "/categories/<int:id>", endpoint="categories/<int:id>")


# Handles BadRequests, KeyErrors, ValueErrors
def handle_error(e):
    error_message = str(e)
    status_code = 500
    if isinstance(e, BadRequest):
        error_message = e.description if e.description else "Bad request"
        status_code = e.code
    elif isinstance(e, KeyError):
        error_message = f"Missing key: {str(e)}"
        status_code = 400
    elif isinstance(e, ValueError):
        error_message = str(e)
        status_code = 422
    return make_response(jsonify({"error": error_message}), status_code)


# For all ById resources, check id exists, return error message if not
def check_id(model, id, user_id):
    if user_id is None:
        raise Unauthorized("Unauthorized")
    obj = model.query.filter_by(id=id).first()
    if not obj:
        raise NotFound(f"{model.__name__} {id} does not exist")
    if obj.user_id != user_id:
        raise Forbidden(f"User {user_id} is not authorized to use {model.__name__} '{id}'")
    return obj

# For all Post methods, check if name exists for user_id, return error message if not
def check_name_exist(model, name, user_id):
    if user_id is None:
        raise Unauthorized("Unauthorized")
    existing_name = model.query.filter(func.lower(model.name) == func.lower(name), model.user_id == user_id).first()
    if existing_name:
        raise UnprocessableEntity(f"{model.__name__} '{name}' already exists for this user")

# App level error handler for all HTTP errors
@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return make_response(
        jsonify({"error": e.description if e.description else "Internal Server Error"}),
        e.code,
    )


if __name__ == "__main__":
    app.run(port=5555, debug=True)
