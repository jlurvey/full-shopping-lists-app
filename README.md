This application is a full-stack application allowing a user to signup and login to manage, add, and delete items, stores, and notes. It provides an easy-to-use interface built with React in the frontend and utilizes a backend built in Python with the Flask framework. The database is hosted on Render.

## Contents
- Getting Started
- Prerequisites
- Installation, Setup, and run
- Backend
- Built With
- Features
- API Endpoints
- Database
- Other Files
- Frontend
- Built With
- Features
- Components
- Application Structure

## Getting Started
### Prerequisites
Ensure you have Python 3 and Node.js installed on your system.

### Installation, Setup, and Run
1. Clone the repo:
   - `git clone https://github.com/jlurvey/full-shopping-lists-app.git`
2. Install dependencies:
   - `pipenv install && pipenv shell`
   - `npm install --prefix client`
3. Configure environment variables:
   - `cd server`
   - `export FLASK_APP=app.py`
   - `export FLASK_RUN_PORT=5555`
4. Create and seed (optional) the database:
   - `flask db init`
   - `flask db migrate -m 'initial migration'`
   - `flask db upgrade head`
   - `python seed.py` (optional)
5. Run backend application:
   - `python app.py`
6. In a separate terminal, start the React app:
   - `npm start`
7. Open application: [http://localhost:3000](http://localhost:3000)

## Backend
### Built With
- Python 3
- Flask

### Features
The server provides API endpoints and utilizes the Flask-RESTful extension for creating RESTful APIs and error handling for bad requests.

### API Endpoints
The application provides various API endpoints along with their respective functions:
- `/api/items` (GET: Retrieve all items, POST: Create a new item)
- `/api/items/<int:id>` (GET: Retrieve an item by ID, PATCH: Update an item by ID, DELETE: Delete an item by ID)
- `/api/stores` (GET: Retrieve all stores, POST: Create a new store)
- `/api/stores/<int:id>` (GET: Retrieve a store by ID, PATCH: Update a store by ID, DELETE: Delete a store by ID)
- `/api/notes` (GET: Retrieve all notes, POST: Create a new note)
- `/api/notes/<int:id>` (GET: Retrieve a note by ID, PATCH: Update a note by ID, DELETE: Delete a note by ID)
- `/api/categories` (GET: Retrieve all categories, POST: Create a new category)
- `/api/categories/<int:id>` (GET: Retrieve a category by ID, PATCH: Update a category by ID, DELETE: Delete a category by ID)
- `/api/signup` (POST: Create a new user account)
- `/api/check_session` (GET: Check if the user is logged in)
- `/api/login` (POST: Log in to an existing user account)
- `/api/logout` (DELETE: Log out of the current session)

## Database
The application utilizes a PostgreSQL database specified by the DATABASE_URI environment variable which is linked to a database hosted on Render.

### Models
The application uses the following models and contains basic validations for those models. Item and Store have a many-to-many relationship with Note as the association model. Category and Item have a one-to-many relationship.

- Item:
  - id: Integer, primary key
  - name: String, unique, required
  - category_id: Integer, foreign key to Category
  - need: Boolean, default: True
  - user_id: Integer, foreign key to User

- Store:
  - id: Integer, primary key
  - name: String, unique, required
  - user_id: Integer, foreign key to User

- Note:
  - id: Integer, primary key
  - description: String, required
  - item_id: Integer, foreign key to Item
  - store_id: Integer, foreign key to Store
  - user_id: Integer, foreign key to User

- Category:
  - id: Integer, primary key
  - name: String, unique, required
  - user_id: Integer, foreign key to User

- User:
  - id: Integer, primary key
  - email: String, unique, required
  - password: String, required

### Other Files
- `seed.py`: Script that populates the database with random sample data. Run it with `python seed.py`.
- `config.py`: Configuration file.

## Frontend
### Built With
- React
- Redux
- React Router
- Axios
- Formik
- Yup

### Features
The frontend application allows users to manage items, stores, and lists. Users can update the need status of items, add notes to items, add and delete items and stores, and filter items by store.

### Components
Key components of the application include:
- App - Root component, contains routes
- NavBar - Navigation links
- Landing - Landing page where User can signup or login
- Home - Page with brief app instructions
- LogoutButton - Button to log a user out
- ItemsList - Displays all items
- Item - Single item component
- AddItemForm - Form to add new items
- AddToStoreForm - Form to add item to store
- CategoriesList - Displays all categories
- Category - Single category component
- AddCategoryForm - Form to add new category
- StoresList - Displays all stores
- Store - Single store component
- AddStoreForm - Form to add new stores
- Lists - Displays items filtered by selected store
- ListsItem - Single item for a store list
- ListsForm - Form to add item to selected store

### Application Structure
The key parts of the application are:
- React Router (`src/components/App.js`)
- Redux (`src/features`)
- Axios
- Store (`src/store.js`)

The application's state is managed by Redux and is split into "slices", with each entity having its own slice. Here are the different slices contained in the `/features` directory and combined in `/store.js`:
- items - Contains all item data
- stores - Contains all store data
- notes - Notes linking items and stores
- categories - Contains all category data