# 1086 ATTENDANCE TRACKER PYTHON BACK-END

import os

# importing flask and it's related functions
from flask import Flask, render_template, request, url_for, redirect

# importing SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

app = Flask(__name__)


# if __name__ == "__main__":
#     app.run(debug=True)


# programming
# build
# cad
# advocacy
# impact
# outreach
# media
# fabrication

# programming = Subteam(subteam_name="programming");
# build = Subteam(subteam_name="build");
# cad = Subteam(subteam_name="cad");
# advocacy = Subteam(subteam_name="advocacy");
# impact = Subteam(subteam_name="impact");
# outreach = Subteam(subteam_name="outreach");
# media = Subteam(subteam_name="media");
# fabrication = Subteam(subteam_name="fabrication");

# db.session.add_all([programming, build, cad, advocacy, impact, outreach, media, fabrication])
# db.session.commit()


# setting the base directory to the current file's directory
basedir = os.path.abspath(os.path.dirname(__file__))

# creating the flask application instance


# configuration keys for SQLAlchemy, the first is for specifying which database to connect to
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:postgres@localhost:5432/postgres'
app.config['SQLALCHEMY_TRACK_NOTIFICATIONS'] = False

# storing database object
db = SQLAlchemy(app)

# outdated template
# class Test(db.Model):
#     # creating the columns, with datatypes and constraints
#     uid = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
#     firstname = db.Column(db.String(50), nullable = False)
#     lastname = db.Column(db.String(50), nullable = False)
#     email = db.Column(db.String(100), unique = True, nullable = False)
#     status = db.Column(db.String(20), nullable = False)
#     created_at = db.Column(db.DateTime(timezone = True), server_default = func.now())

#     # gives each object a string representation, for debugging purposes (not necessary)
#     def __repr__(self):
#         return f"< Member {self.firstname} >" 



class Subteam(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "subteam"

    subteam_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    subteam_name = db.Column(db.String(50), nullable = False)



class Member(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "member"

    member_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    firstname = db.Column(db.String(50), nullable = False)
    lastname = db.Column(db.String(50), nullable = False)
    status = db.Column(db.String(50), nullable = False,)
    type = db.Column(db.String(50), nullable = False,)



class TeamMember(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "team_member"

    uuid = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    subteam_id = db.Column(db.Integer, db.ForeignKey("subteam.subteam_id"))
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))



class Veteran(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "veteran"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)


    
class Rookie(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "rookie"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)



class Fulltime(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "fulltime"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)


    
class Parttime(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "parttime"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)



class Log(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "scanning_log"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)
    created_at = db.Column(db.DateTime(timezone = True), server_default = func.now())


# Just in case:
    # firstname = db.Column(db.String(50), db.ForeignKey("member.firstname"))
    # lastname = db.Column(db.String(50), db.ForeignKey("member.lastname"))
    # status = db.Column(db.String(50), db.ForeignKey("member.status"))
    # type = db.Column(db.String(50), db.ForeignKey("member.type"))




# *** Note: run the following
    # set FLASK_APP=app.py
    # python -m flask shell

    # db.create_all()

    # programming = Subteam(subteam_name="programming");
    # build = Subteam(subteam_name="build");
    # cad = Subteam(subteam_name="cad");
    # advocacy = Subteam(subteam_name="advocacy");
    # impact = Subteam(subteam_name="impact");
    # outreach = Subteam(subteam_name="outreach");
    # media = Subteam(subteam_name="media");
    # fabrication = Subteam(subteam_name="fabrication");

    # db.session.add_all([programming, build, cad, advocacy, impact, outreach, media, fabrication])
    # db.session.commit()



# I don't know what this does for now so I commented it out.
    
# @app.route("/")
# def hello():
#      return "200/ok"

# if __name__ == "__main__":
#     app.run(host='0.0.0.0')