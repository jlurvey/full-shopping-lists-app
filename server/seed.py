#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Item, Store, Note

if __name__ == '__main__':

    fake = Faker()

    with app.app_context():
        print("Deleting all records...")
        Item.query.delete()
        Store.query.delete()
        Note.query.delete()

        print("Starting seed...")
        print("Creating 20 items...")
        # items have unique names
        items = []
        item_names = []
        categories = ['grocery store', 'hardware store',
                      'pharmacy', 'convenience store', 'department store']

        for i in range(20):
            name = fake.word()

            while name in item_names:
                name = fake.word()
                item_names.append(name)

            item = Item(
                name=name,
                category=rc(categories),
                need=fake.boolean()
            )

            items.append(item)

        db.session.add_all(items)
        db.session.commit()

        print("Creating 5 stores...")
        stores = []
        store_names = []

        for i in range(5):
            name = fake.company()

            while name in store_names:
                name = fake.company()
                store_names.append(name)

            store = Store(name=name)
            stores.append(store)

        db.session.add_all(stores)
        db.session.commit()

        print("Creating 15 notes...")
        notes = []
        existing_combo = set()

        for i in range(15):
            item = rc(items)
            store = rc(stores)
            description = fake.sentence()
            combo = (item.id, store.id)

            while combo in existing_combo:
                item = rc(items)
                store = rc(stores)
                combo = (item.id, store.id)

            existing_combo.add(combo)

            note = Note(
                description=description,
                item_id=item.id,
                store_id=store.id,
            )

            notes.append(note)

        db.session.add_all(notes)
        db.session.commit()

        print('Seed completed.')
