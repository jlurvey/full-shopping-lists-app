#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import jsonify, make_response, request
from flask_restful import Resource
from werkzeug.exceptions import BadRequest, HTTPException, NotFound

# Local imports
from config import app, db, api
# Add your model imports
from models import Item, Store, Note

# Views go here!


@app.route('/')
def index():
    return '<h1>Project Server</h1>'


class ItemIndex(Resource):
    def get(self):
        items = [item.to_dict() for item in Item.query.all()]
        return make_response(jsonify(items), 200)

    def post(self):
        data = request.get_json()
        try:
            new_item = Item(
                name=data['name'],
                category=data['category'],
                need=data['need'],
            )
            db.session.add(new_item)
            db.session.commit()
            return make_response(new_item.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)
        

class ItemById(Resource):
    def get(self, id):
        item = check_id(Item, id)
        return make_response(jsonify(item.to_dict()), 200)
            
    def patch(self, id):
        data = request.get_json()
        item = check_id(Item, id)
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
        item = check_id(Item, id)
        try:
            db.session.delete(item)
            db.session.commit()
            make_response('', 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class StoreIndex(Resource):
    def get(self):
        stores = [store.to_dict() for store in Store.query.all()]
        return make_response(jsonify(stores), 200)

    def post(self):
        data = request.get_json()
        try:
            new_store = Store(name=data['name'])
            db.session.add(new_store)
            db.session.commit()
            return make_response(new_store.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)


class StoreById(Resource):
    def get(self, id):
        store = check_id(Store, id)
        return make_response(jsonify(store.to_dict()), 200)
    
    def patch(self, id):
        data=request.get_json()
        store = check_id(Store, id)
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
        store = check_id(Store, id)
        try:
            db.session.delete(store)
            db.session.commit()
            return make_response('', 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)

class NoteIndex(Resource):
    def get(self):    
        notes = [note.to_dict() for note in Note.query.all()]
        return make_response(jsonify(notes), 200)
    def post(self):
        data = request.get_json()
        try:
            new_note = Note(
                description=data['description'],
                item_id=data['item_id'],
                store_id=data['store_id'],
            )
            db.session.add(new_note)
            db.session.commit()
            return make_response(new_note.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)
        
class NoteById(Resource):
    def get(self, id):
        note = check_id(Note, id)
        return make_response(jsonify(note.to_dict()), 200)
    def patch(self, id):
        data=request.get_json()
        note = check_id(Note, id)
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
        note = check_id(Note, id)
        try:
            db.session.delete(note)
            db.session.commit()
            return make_response('', 204)
        except Exception as e:
            db.session.rollback()
            return handle_error(e)
    


api.add_resource(ItemIndex, '/items', endpoint='items')
api.add_resource(ItemById, '/items/<int:id>', endpoint='items/<int:id>')
api.add_resource(StoreIndex, '/stores', endpoint='stores')
api.add_resource(StoreById, '/stores/<int:id>', endpoint='stores/<int:id>')
api.add_resource(NoteIndex, '/notes', endpoint='notes')
api.add_resource(NoteById, '/notes/<int:id>', endpoint='notes/<int:id>')

def handle_error(e):
    error_message = str(e)
    status_code = 500
    if isinstance(e, BadRequest):
        error_message = e.description if e.description else 'Bad request'
        status_code = e.code
    elif isinstance(e, KeyError):
        error_message = f'Missing key: {str(e)}'
        status_code = 400
    elif isinstance(e, ValueError):        
        error_message = str(e)
        status_code = 422

    return make_response(jsonify({'error': error_message}), status_code)

def check_id(model, id):
    obj = model.query.filter_by(id=id).first()
    if not obj:
        raise NotFound(f'{model.__name__} {id} does not exist')
    return obj

#App level error handler for all HTTP errors
@app.errorhandler(HTTPException)
def handle_http_exception(e):
    return make_response(jsonify({'error': e.description if e.description else 'Internal Server Error'}), e.code)

if __name__ == '__main__':
    app.run(port=5555, debug=True)