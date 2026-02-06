# 1086 ATTENDANCE TRACKER PYTHON BACK-END

import os

# importing flask and it's related functions
from flask import Flask, render_template, request, url_for, redirect

# importing SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# I don't know what this does for now so I commented it out.

# @app.route("/")
# def hello():
#     return "200/ok"

# if __name__ == "__main__":
#     app.run(host='0.0.0.0')



# setting the base directory to the current file's directory
basedir = os.path.abspath(os.path.dirname(__file__))

# creating the flask application instance
app = Flask(__name__)

# configuration keys for SQLAlchemy, the first is for specifying which database to connect to
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False

# storing database object
db = SQLAlchemy(app)

# creating a table model as a class
class Member(db.Model):
    # creating the columns, with datatypes and constraints
    uid = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    firstname = db.Column(db.String(50), nullable = False)
    lastname = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(100), unique = True, nullable = False)
    status = db.Column(db.String(20), nullable = False)
    created_at = db.Column(db.DateTime(timezone = True), server_default = func.now())

    # gives each object a string representation, for debugging purposes (not necessary)
    def __repr__(self):
        return f"< Member {self.firstname} >"

