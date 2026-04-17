# 1086 ATTENDANCE TRACKER PYTHON BACK-END

import os

# importing postgres database adapter

import psycopg2

# date for the checkin

from datetime import datetime

# importing flask and it's related functions
from flask import Flask, render_template, request, url_for, redirect

# importing SQLAlchemy
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func


# importing some stuff for dropping tables (testing)
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy.schema import DropConstraint, DropTable, MetaData, Table, ForeignKeyConstraint

# improting migrate
from flask_migrate import Migrate

# importing dotenv and loading
from dotenv import load_dotenv
load_dotenv()


# creating the flask application instance
app = Flask(__name__, 
            static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static'),
            static_url_path='/static')



# setting the base directory to the current file's directory
basedir = os.path.abspath(os.path.dirname(__file__))


# configuration keys for SQLAlchemy, the first is for specifying which database to connect to
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# storing database object
db = SQLAlchemy(app)

# creating migrate variable
migrate = Migrate(app, db)

# some commands for migrating

# flask db stamp head makes this version of the database the most recent one.
# run it if there is a flask_migrate "Can't locate revision" error, or an
# error with local and server database changes
# if still not working, drop the alembic_version table in psql and unnecessary constraints

# flask db migrate -m "enter message" will push this version of the database to the versions folder
# you will need this to update the database

# flask db upgrade upgrades the database, setting it to the most recent migrated version

# to run any of these commands without the flask shell, because you can't use flask shell on school computer, 
# use python -m flask in front of the command - for example, python -m flask db stamp head




# outdated template - used previously, backup for possible future use
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
    # creating the columns, with datatypes and constraints for the primary subteam
    __tablename__ = "p_subteam"

    p_subteam_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    p_subteam_name = db.Column(db.String(50), nullable = False)


# use if able to get secondary subteams - we were not able to get this working with out time constraints
# class SecondarySubteam(db.Model):
#     # creating the columns, with datatypes and constraints
#     __tablename__ = "s_subteam"

#     s_subteam_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
#     s_subteam_name = db.Column(db.String(50), nullable = False)



class Member(db.Model):
    # creating the columns, with datatypes and constraints, for each individual member
    __tablename__ = "member"

    member_id = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
    username = db.Column(db.String(50), unique = True, nullable = False)
    name = db.Column(db.String(50), nullable = False)
    email = db.Column(db.String(100), nullable = False)
    password = db.Column(db.String(100), nullable = False)
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("p_subteam.p_subteam_id"))
    status = db.Column(db.String(50), nullable = False)
    grade = db.Column(db.Integer, nullable = True)


# suggested use of organization by Mr. Miller that was scrapped
# class TeamMember(db.Model):
#     # creating the columns, with datatypes and constraints
#     __tablename__ = "team_member"

#     uuid = db.Column(db.Integer, unique = True, primary_key = True, nullable = False)
#     p_subteam_id = db.Column(db.Integer, db.ForeignKey("p_subteam.p_subteam_id"))
#     s_subteam_id = db.Column(db.Integer, db.ForeignKey("s_subteam.s_subteam_id"))
#     member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))



class Veteran(db.Model):
    # creating the columns, with datatypes and constraints, for veterans
    __tablename__ = "veteran"

    uuid = db.Column(db.Integer, unique = True, primary_key=True, nullable=False)
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))


    
class Rookie(db.Model):
    # creating the columns, with datatypes and constraints, for rookies
    __tablename__ = "rookie"

    uuid = db.Column(db.Integer, unique = True, primary_key=True, nullable=False)
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))



class InSeason(db.Model):
    # creating the columns, with datatypes and constraints - inseason
    __tablename__ = "fulltime"

    uuid = db.Column(db.Integer, unique = True, primary_key=True, nullable=False)
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))


    
class OffSeason(db.Model):
    # creating the columns, with datatypes and constraints - outseason
    __tablename__ = "parttime"

    uuid = db.Column(db.Integer, unique = True, primary_key=True, nullable=False)
    p_subteam_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))



class Log(db.Model):
    # creating thee log where each attendance should be stored
    __tablename__ = "scanning_log"

    uuid = db.Column(db.Integer, unique=True, primary_key=True, nullable=False)
    member_id = db.Column(db.Integer, db.ForeignKey("member.member_id"))
    event_name = db.Column(db.String(100), nullable=True)
    check_in_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())



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
    
# old syntax for establishing tables, don't think it is necessary with migrations


# creating the tables - function
def create_tables():
    with app.app_context():
        db.create_all()


# drops all tables and related data. ONLY USE FOR TESTING PURPOSES.
def drop_tables():
    """Drops all foreign key constraints before dropping all tables."""
    with app.app_context():
        con = db.engine.connect()
        trans = con.begin()
        inspector = Inspector.from_engine(db.engine)

        meta = MetaData()
        tables = []
        all_fkeys = []

        for table_name in inspector.get_table_names():
            fkeys = []
            for fkey in inspector.get_foreign_keys(table_name):
                if not fkey["name"]:
                    continue
                fkeys.append(db.ForeignKeyConstraint((), (), name=fkey["name"]))
            tables.append(Table(table_name, meta, *fkeys))
            all_fkeys.extend(fkeys)

        # Drop all foreign key constraints first
        for fkey in all_fkeys:
            con.execute(DropConstraint(fkey))

        # Drop all tables next
        for table in tables:
            con.execute(DropTable(table))

        trans.commit()
        con.close()
        print("All tables and constraints dropped (dependency error solved).")

create_tables()



# here are connections to website all down below
# the general idea is that it renders the template of the html file, which is connected to the database data
# if one of these functions is larger, that means that there is more going on behind it, such as fetching member data

@app.route("/")
def index():
    return render_template("flasktest-auth.html")

@app.route("/home")
def home():
    return render_template("index.html")

@app.route("/auth")
def auth():
    return render_template("flasktest-auth.html")

@app.route("/information")
def information():
    return render_template("flasktest-information.html")

@app.route("/camera")
def camera():
    return render_template("flasktest-camera.html")

@app.route("/admin")
def admin():
    return render_template("flasktest-admin.html")

@app.route("/checkin")
def checkin():
    return render_template("flasktest-submit.html")

@app.route("/profile")
def profile():
    return render_template("flasktest-profile.html")

# all more basic routing so far. here is a more complex one

# using get method to get data
@app.route("/api/profile", methods=["GET"])
def api_profile_get():
    member_id = request.args.get("member_id")
    if not member_id:
        return {"error": "member_id is required."}, 400

    member = Member.query.get(member_id)
    if not member:
        return {"error": "Member not found."}, 404

    subteam_name = ""
    if member.p_subteam_id:
        subteam = PrimarySubteam.query.get(member.p_subteam_id)
        if subteam:
            subteam_name = subteam.p_subteam_name.capitalize()

    # returning member information
    return {
        "username": member.username,
        "name": member.name,
        "email": member.email,
        "status": member.status,
        "subteam": subteam_name,
        "grade": member.grade
    }, 200


# putting data
@app.route("/api/profile", methods=["PUT"])
def api_profile_put():
    data = request.get_json()
    member_id = data.get("member_id")
    if not member_id:
        return {"error": "member_id is required."}, 400

    member = Member.query.get(member_id)
    if not member:
        return {"error": "Member not found."}, 404

    new_username = data.get("username")
    new_password = data.get("password")

    if new_username:
        existing = Member.query.filter_by(username=new_username).first()
        if existing and existing.member_id != member.member_id:
            return {"error": "Username already taken."}, 400
        member.username = new_username

    if new_password:
        member.password = new_password

    # commit to the database session, which changes database
    db.session.commit()
    return {"message": "Profile updated."}, 200


# checking in, so posting data
@app.route("/api/checkin", methods=["POST"])
def api_checkin():
    data = request.get_json()
    if not data:
        return {"error": "No data provided."}, 400

    member_id = data.get("member_id")
    event_name = data.get("event_name")
    check_in_date_str = data.get("check_in_date")

    if not member_id:
        return {"error": "member_id is required."}, 400
    if not event_name:
        return {"error": "Event name is required."}, 400
    if not check_in_date_str:
        return {"error": "Date is required."}, 400

    member = Member.query.get(member_id)
    if not member:
        return {"error": "Member not found."}, 404

    try:
        check_in_date = datetime.strptime(check_in_date_str, "%Y-%m-%d").date()
    except ValueError:
        return {"error": "Invalid date format."}, 400

    # updates the scanning log with data after session commit
    log = Log(
        member_id=member_id,
        event_name=event_name.strip(),
        check_in_date=check_in_date
    )

    # adding and commiting to session
    db.session.add(log)
    db.session.commit()
    return {"message": "Attendance recorded."}, 201



# fetching member data
@app.route("/api/members", methods=["GET"])
def api_members():
    members = Member.query.all()
    result = []
    for m in members:
        subteam_name = ""
        if m.p_subteam_id:
            subteam = PrimarySubteam.query.get(m.p_subteam_id)
            if subteam:
                subteam_name = subteam.p_subteam_name.capitalize()
        type_label = m.status.capitalize() if m.status else ""
        actual_n = Log.query.filter_by(member_id=m.member_id).count()
        min_n = 7 if type_label == "Veteran" else 5
        result.append({
            "name": m.name,
            "grade": m.grade or "",
            "subteam": subteam_name,
            "type": type_label,
            "actual_n": actual_n,
            "risk": actual_n < min_n
        })
    return result

# route for signup
@app.route("/api/signup", methods=["POST"])
def api_signup():
    data = request.get_json()
    username = data.get("username")
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    subteams = data.get("subteams", [])
    member_type = data.get("memberType")
    grade = data.get("grade")

    if not username or not name or not email or not password or not member_type:
        return {"error": "All fields are required."}, 400

    if Member.query.filter_by(username=username).first():
        return {"error": "Username already taken."}, 400

    if Member.query.filter_by(email=email).first():
        return {"error": "Email already registered."}, 400

    p_subteam_id = None
    if subteams:
        subteam = PrimarySubteam.query.filter_by(p_subteam_name=subteams[0]).first()
        if subteam:
            p_subteam_id = subteam.p_subteam_id

    new_member = Member(username=username, name=name, email=email, password=password, p_subteam_id=p_subteam_id, status=member_type, grade=grade)
    db.session.add(new_member)
    db.session.commit()
    return {"message": "Account created."}, 201

# route for login
@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    member = Member.query.filter_by(username=username, password=password).first()
    if not member:
        return {"error": "Invalid username or password."}, 401

    return {"message": "Login successful.", "member_id": member.member_id}, 200


@app.route("/api/events", methods=["GET"])
def api_events():
    rows = db.session.query(Log, Member).join(Member, Log.member_id == Member.member_id).all()
    events = {}
    for log, member in rows:
        if not log.event_name or not log.check_in_date:
            continue
        key = (log.event_name, log.check_in_date.isoformat())
        if key not in events:
            events[key] = {
                "title": log.event_name,
                "start": log.check_in_date.isoformat(),
                "extendedProps": {"attendees": []}
            }
        events[key]["extendedProps"]["attendees"].append(member.name)
    return list(events.values())


@app.route("/members", methods=["GET"])
def display_users():
    members = Member.query.all()
    return render_template("flasktest-members.html", members=members)


# running app
if __name__ == "__main__":
    app.run(debug=True)
