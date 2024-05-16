# seed.py
#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Item, Store, Note, Category

if __name__ == "__main__":

    fake = Faker()

    with app.app_context():
        print("Deleting all records...")
        Item.query.delete()
        Store.query.delete()
        Note.query.delete()
        Category.query.delete()

        print("Starting seed...")

        print("Creating 5 categories")
        categories = []
        for category_name in [
            "grocery store",
            "hardware store",
            "pharmacy",
            "convenience store",
            "department store",
        ]:
            category = Category(name=category_name)
            categories.append(category)
        db.session.add_all(categories)
        db.session.commit()

        print("Creating 20 items...")
        # items have unique names
        categories = Category.query.all()
        items = []
        item_names = []
        while len(items) < 15:
            name = fake.word()
            while name in item_names:
                name = fake.word()
            category = rc(categories)
            item_names.append(name)
            item = Item(name=name, category_id=category.id, need=fake.boolean())
            db.session.add(item)
            items.append(item)
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
        items = Item.query.all()
        stores = Store.query.all()
        notes = []
        while len(notes) < 15:
            item = rc(items)
            store = rc(stores)
            existing_note = Note.query.filter_by(
                item_id=item.id, store_id=store.id
            ).first()
            if existing_note:
                continue
            note = Note(item_id=item.id, store_id=store.id, description=fake.text())
            db.session.add(note)
            notes.append(note)
        db.session.commit()
        print("Seed complete.")
