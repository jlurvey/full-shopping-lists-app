#!/usr/bin/env python3

# Standard library imports
from random import random, randint, choice as rc

# Remote library imports
from faker import Faker
from faker.providers import BaseProvider

# Local imports
from app import app
from models import db, Item, Store, Note

if __name__ == '__main__':
    
    fake = Faker()
    
    with app.app_context():
        
        print("Starting seed...")
        print("Creating items")
        
        #items have unique names
        items = []
        names = []
        categories = ['grocery store','hardware store','pharmacy store','convenience store','department store']

        for i in range(20):

            name = fake.word()
            while name in names:
                name = fake.word()
                names.append(name)
            
            item = Item(
                name=name,
                category=random.choice(categories),
                need=fake.boolean()
            )

            items.append(item)

        db.session.add_all(items)




                

