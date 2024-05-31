# seed.py
#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Item, Store, Note, Category, User

if __name__ == "__main__":

    fake = Faker()

    with app.app_context():
        print("Deleting all records...")
        Item.query.delete()
        Store.query.delete()
        Note.query.delete()
        Category.query.delete()
        User.query.delete()

        print("Starting seed...")

        print("Creating 2 users")
        users = []
        user_emails = []
        while len(users) < 2:
            email = fake.email()
            while email in user_emails:
                email = fake.email()
            password = fake.password()
            user_emails.append(email)
            user = User(email=email, password=password)
            users.append(user)
        db.session.add_all(users)
        db.session.commit()

        print("Creating 5 categories")
        categories = []
        for category_name in [
            "grocery store",
            "hardware store",
            "pharmacy",
            "convenience store",
            "department store",
        ]:
            category = Category(name=category_name, user=rc(users))
            db.session.add(category)
            categories.append(category)
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
            item = Item(
                name=name,
                category_id=category.id,
                need=fake.boolean(),
                user_id=category.user_id,
            )
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
            store = Store(name=name, user=rc(users))
            db.session.add(store)
            stores.append(store)
        db.session.commit()

        print("Creating 15 notes...")
        items = Item.query.all()
        stores = Store.query.all()
        notes = []
        while len(notes) < 15:
            item = rc(items)
            store = rc(stores)
            if item.user_id != store.user_id:
                continue
            existing_note = Note.query.filter_by(
                item_id=item.id, store_id=store.id
            ).first()
            if existing_note:
                continue
            # print(f"Creating note for Item {item.id} (User {item.user_id}) and Store {store.id} (User {store.user_id})")
            note = Note(
                item_id=item.id,
                store_id=store.id,
                description=fake.text(),
                user_id = item.user_id,
            )
            db.session.add(note)
            notes.append(note)
        db.session.commit()
        print("Seed complete.")
