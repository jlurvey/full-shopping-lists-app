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
        items = Item.query.all()
        items_data = []
        for item in items:
            item_data = {
                'name': item.name,
                'category': item.category,
                'need': item.need,
                'stores': [{'name': store.name} for store in item.stores],
            }
            items_data.append(item_data)
        return items_data, 200
    
    def post(self):
        data = request.get_json()
        
        try:
            new_item = Item(
                name = data['name'],
                category = data['category'],
                need = data['need'],
                )
            
            db.session.add(new_item)
            db.session.commit()

            return make_response(new_item.to_dict(),201)
        
        except ValueError as e:
            db.session.rollback()
            return {'error': str(e)}, 422
        


class StoreIndex(Resource):
    def get(self):
        stores=Store.query.all()
        stores_data = []
        for store in stores:
            store_data = {
                'name':store.name,
                'items':[{'name': item.name} for item in store.items]
            }
            stores_data.append(store_data)
        return stores_data, 200
    
    def post(self):
        data = request.get_json()

        try:
            new_store = Store(name=data['name'])

            db.session.add(new_store)
            db.session.commit()

            return make_response(new_store.to_dict(),201)
                
        except ValueError as e:
            db.session.rollback()
            return{'error': str(e)}, 422

api.add_resource(ItemIndex, '/items', endpoint='items')
api.add_resource(StoreIndex,'/stores', endpoint = 'stores')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

