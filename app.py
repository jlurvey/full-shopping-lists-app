#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import jsonify, make_response, request
from flask_restful import Resource

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
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 422


class ItemByID(Resource):
    def get(self, id):
        item = Item.query.filter_by(id=id).first().to_dict()
        return make_response(jsonify(item), 200)

    def patch(self, id):
        data = request.get_json()
        item = Item.query.filter_by(id=id).first()
        try:
            for attr in data:
                setattr(item, attr, data[attr])
            db.session.add(item)
            db.session.commit()
            return make_response(item.to_dict(), 200)
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 422

    def delete(self, id):
        item = Item.query.filter_by(id=id).first()
        try:
            db.session.delete(item)
            db.session.commit()
            make_response('', 204)
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 422


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
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 422


class StoreByID(Resource):
    def get(self, id):
        store = Store.query.filter_by(id=id).first().to_dict()
        return make_response(jsonify(store), 200)

api.add_resource(ItemIndex, '/items', endpoint='items')
api.add_resource(ItemByID, '/items/<int:id>', endpoint='items/<int:id>')
api.add_resource(StoreIndex, '/stores', endpoint='stores')
api.add_resource(StoreByID, '/stores/<int:id>', endpoint='stores/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)