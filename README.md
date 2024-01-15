# Apartment Rentals
This is an MVP project with the full features needed for an apartment rental web app.

Users can choose many login options from the login page: log in with a password, log in with Facebook, and log in with Google. If the user fails to log in three consecutive times, they will be blocked. The admin can manually unblock them in the Admin Dashboard.

There are three accounts: normal users, agencies, and admins. Agencies can post apartments for rent. Admins can manage everything. Users can search for apartments by number of rooms, area, price range, etc. Search results can be shown in 2 views: list and map. With map view option, users can filter by distance to their locations.

The challenging part of this project was using GeoDjango and PostGIS or SpatiaLite to store apartment longitudes and latitudes. Also, the GIS technology supports querying by distance compared to the preferred location.

## Demo
https://tn-apartment-rental.herokuapp.com/

## Techincal stack
- *Backend:* Django Rest Framework
- *Frontend:* React + Redux
- This project use GeoDjango to store locations and support distance query on map. You must have `PostGIS` extension if you want to use `PostgreSQL` or `SpatiaLite` if you use `SQLite`.

## Installation Steps

### Backend Installation

`pipenv install --dev` to create virtual environment of Python

`pipenv shell` to activate the virtual environment

`cd backend` go to backend source code

`python manager.py migrate` to initalize database

`python manager.py createsuperuser` to create super user.

`python manager.py runserver` to start backend server, the port will be 8000

### Frontend Installation

`cd frontend` go to frontend source code

`yarn install` to install dependencies

`yarn start` to start frontend, the port will be 3000

### Django Admin
`http://localhost:8000/admin` is the route to admin. Only super admin can access this. Use this tool to register Facebook, Google Apps for social login. Also for adding first Admin for the app.

### Frontend environment variables
This project some 3rd services: Google Map, Facebook Login, Google Login. The 3rd credentials should be stored in a `.env` inside `frontend` folder. Please create your own `.env` with the following variables
```REACT_APP_FB_APP_ID=YOUR_FACEBOOK_APP_ID
REACT_APP_GG_APP_ID=YOUR_GOOGLE_APP_ID
REACT_APP_GG_MAP_API_KEY=YOUR_GOOGLE_MAP_API_KEY
REACT_APP_BACKEND_HOST=http://localhost:8000
```

### Run tests
`python manager.py test` to run API tests
