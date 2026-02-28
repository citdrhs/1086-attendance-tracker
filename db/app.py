# 1086 ATTENDANCE TRACKER PYTHON BACK-END

import os

# importing flask and it's related functions
from flask import Flask, render_template, request, url_for, redirect

# importing SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

# importing dotenv
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)



# setting the base directory to the current file's directory
basedir = os.path.abspath(os.path.dirname(__file__))

# creating the flask application instance


# configuration keys for SQLAlchemy, the first is for specifying which database to connect to
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI")
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



class PrimarySubteam(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "p_subteam"

    p_subteam_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    p_subteam_name = db.Column(db.String(50), nullable = False)



class SecondarySubteam(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "s_subteam"

    s_subteam_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    s_subteam_name = db.Column(db.String(50), nullable = False)



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
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("p_subteam.p_subteam_id"))
    s_subteam_id = db.Column(db.Integer, db.ForeignKey("s_subteam.s_subteam_id"))
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))



class Veteran(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "veteran"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)


    
class Rookie(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "rookie"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)



class InSeason(db.Model):
    # creating the columns, with datatypes and constraints
    __tablename__ = "fulltime"

    uuid = db.Column(db.Integer, db.ForeignKey("team_member.uuid"), primary_key = True)


    
class OffSeason(db.Model):
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
    
# programming = PrimarySubteam(p_subteam_name="programming");
# build = PrimarySubteam(p_subteam_name="build");
# cad = PrimarySubteam(p_subteam_name="cad");
# advocacy = PrimarySubteam(p_subteam_name="advocacy");
# impact = PrimarySubteam(p_subteam_name="impact");
# outreach = PrimarySubteam(p_subteam_name="outreach");
# media = PrimarySubteam(p_subteam_name="media");

# programming2 = SecondarySubteam(s_subteam_name="programming");
# build2 = SecondarySubteam(s_subteam_name="build");
# cad2 = SecondarySubteam(s_subteam_name="cad");
# advocacy2 = SecondarySubteam(s_subteam_name="advocacy");
# impact2 = SecondarySubteam(s_subteam_name="impact");
# outreach2 = SecondarySubteam(s_subteam_name="outreach");
# media2 = SecondarySubteam(s_subteam_name="media");

# db.session.add_all([programming, build, cad, advocacy, impact, outreach, media])
# db.session.add_all([programming2, build2, cad2, advocacy2, impact2, outreach2, media2])
# db.session.commit()



    
# @app.route("/")
# def hello():
#      return "200/ok"

# if __name__ == "__main__":
#     app.run(host='0.0.0.0')