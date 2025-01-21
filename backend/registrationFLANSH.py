from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import json
import os
import base64
import pickle
import traceback
import requests
import cv2

from PIL import Image
from io import BytesIO
import pandas as pd 
from openpyxl import load_workbook
import sqlite3
import uuid 
from datetime import datetime, timedelta
import boto3
from botocore.exceptions import NoCredentialsError
import logging
import traceback

app = Flask(__name__)
CORS(app)

DATA_FILE = 'NewRegistration.xlsx'
DATA_FORM_FILE = 'DataFormAnalysis.json'
IMAGE_DIR = 'images'
RTSP_URL = "rtsp://admin:VCVOIC@45.249.168.237:554/H.264/AVC"

# Initialize registration data file
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'w') as file:
        json.dump([], file)

# Initialize data form file
if not os.path.exists(DATA_FORM_FILE):
    with open(DATA_FORM_FILE, 'w') as file:
        json.dump([], file)

# Ensure image directory exists
if not os.path.exists(IMAGE_DIR):
    os.makedirs(IMAGE_DIR)

S3_BUCKET_NAME1 = 'ipcamera'
S3_CLOUDFRONT_URL1 = 'https://d34xanpfs3oa8l.cloudfront.net/'  # Replace with your CloudFront URL

s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name='ap-south-1'
)

logging.basicConfig(level=logging.ERROR)
error_logger = logging.getLogger("error_logger")

@app.route('/')
def index():
    return jsonify({'message': 'Welcome to the API!'})

@app.route('/new-registration', methods=['POST'])
def new_registration():
    try:
        #log_db_status() 
        data = request.json
        print('Received data:', data)

        id = data.get('id')
        name = data.get('name')
        phone = data.get("phone")
        age = data.get("age")
        email = data.get("email")
        bloodGroup = data.get("bloodGroup")
        height = data.get("height")
        weight = data.get("weight")
        address = data.get("address")
        emergencyContactName = data.get("emergencyContactName")
        emergencyContactNumber = data.get("emergencyContactNumber")
        uid = uuid.uuid4()
        uid = str(uid)
        print(name)
        registration_data = [[uid, id, name, phone, email, age, bloodGroup, height, weight, address, emergencyContactName, emergencyContactNumber]]
        
        now = datetime.now()
        start_date = str(now.strftime("%Y-%m-%d"))
        end_date = str(now + timedelta(days=365))

        try:
            # Connect to the SQLite database with a timeout
            conn = sqlite3.connect('members.db', timeout=30)  # Wait for up to 30 seconds
            conn.execute('PRAGMA journal_mode=WAL;')  # Enable Write-Ahead Logging for better concurrency
            cur = conn.cursor()

            # Perform the insert operation
            cur.execute('INSERT INTO Members (uid, Name , Mobile_Number, Membership, Email, Age, Blood_Group, Height, Weight, Address, Emergency_Contact_Name, Emergency_Contact_Number, Membership_start_date, Membership_end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', (uid, name, phone, id, email, age, bloodGroup, height, weight, address, emergencyContactName, emergencyContactNumber, start_date, end_date))

            # Commit the transaction
            conn.commit()
            print("Committed successfully")
            conn.close()
        except sqlite3.OperationalError as e:
            print(f"Database is locked: {e}")
            return jsonify({'error': 'Database is locked, try again later.'}), 500
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({'error': 'SQLite error occurred'}), 500
        finally:
            # Ensure that the connection is closed
            if conn:
                conn.close()

        return jsonify({'message': 'Registration successful', 'data': registration_data}), 200

    except Exception as e:
        print("Registration failed.")
        #error_logger = logging.getLogger(__name__)
        #error_logger.exception("Error occurred", exc_info=True)
        traceback_str = traceback.format_exc()
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/capture-rtsp', methods=['GET'])
def capture_rtsp_image():
    rtsp_url = "rtsp://admin:VCVOIC@45.249.168.237:554/H.264/AVC"
    # Open the RTSP stream
    cap = cv2.VideoCapture(rtsp_url)

    if not cap.isOpened():
        return jsonify({"error": "Could not open RTSP stream"}), 400

    # Capture a frame
    ret, frame = cap.read()
    if not ret:
        return jsonify({"error": "Could not capture image from RTSP stream"}), 400

    # Convert the frame to JPEG
    _, buffer = cv2.imencode('.jpg', frame)
    img_bytes = base64.b64encode(buffer).decode('utf-8')

    # Release the RTSP stream
    cap.release()

    # Return the image as a base64 string
    return jsonify({"image": img_bytes})

@app.route('/upload-image', methods=['POST'])
def upload_image():
    try:
        data = request.json
        user_id = data.get('id')
        user_name = data.get('name')
        images = data.get('images', [])
        saved_images = []
        simages = []

        # Check if user_id and user_name are not None
        if not user_id or not user_name:
            return jsonify({'error': 'ID and Name are required.'}), 400

        user_dir = os.path.join(IMAGE_DIR, f'{user_name}_{user_id}')
        if not os.path.exists(user_dir):
            os.makedirs(user_dir)

        for idx, image_data in enumerate(images):
            image_base64 = image_data.split(',')[1]
            image_bytes = base64.b64decode(image_base64)
            image_path = os.path.join(user_dir, f'image_{idx + 1}.jpeg')
            simages.append(image_bytes)
            serialized_data = pickle.dumps(simages)
            with open(image_path, 'wb') as image_file:
                image_file.write(image_bytes)
            saved_images.append(image_path)

        mycursor = mydb.cursor()
        sql = "UPDATE Members SET images = %s WHERE id = %s AND member_name = %s"
        val = (serialized_data, user_id, user_name)
        mycursor.execute(sql, val)
        mydb.commit()

        return jsonify({'message': 'Images uploaded successfully', 'images': saved_images}), 200
    except Exception as e:
        print('Error processing request:', e)
        return jsonify({'error': 'Internal Server Error'}), 500


@app.route('/unknown-data-analysis', methods=['GET'])
def unknown_data_analysis():

    try:
            start_date_str = request.args.get('startDate')
            end_date_str = request.args.get('endDate')
            
            if not start_date_str or not end_date_str:
                return jsonify({'error': 'startDate and endDate are required'}), 400

            conn=sqlite3.connect("EntryLog.db")
            cursor= conn.cursor()
            query = 'SELECT DATE(Timestamp_Entry) AS date, COUNT(DISTINCT id) AS unique_count FROM UNKNOWNDB WHERE DATE(Timestamp_Entry) BETWEEN ? AND ? GROUP BY DATE(Timestamp_Entry)' 
            cursor.execute(query, (start_date_str, end_date_str))
            results = cursor.fetchall()
            print("unknown data results:  ", results)
            date_unique_count_dict = {str(row[0]): row[1] for row in results}

            return jsonify(date_unique_count_dict), 200
    except Exception as e:
            print("unknown data..")
           # error_logger.exception("Error occurred", exc_info=True)
            traceback_str = traceback.format_exc()
            return jsonify({"error": str(e)}), 500




'''

cursor.execute(query, (start_date_str, end_date_str))
        # Query the MySQL database
        cursor.execute('SELECT DATE(Timestamp_Entry) AS date, COUNT(DISTINCT id) AS unique_count FROM UNKNOWN_DB WHERE DATE(DATE_TIME) BETWEEN ? AND ? GROUP BY DATE(Timestamp_Entry)' VALUES (start_date_str, end_date_str))   
        #cursor.execute(sql, (start_date_str, end_date_str))
        results = cursor.fetchall()
'''
        # Process results into a dictionary
        #date_unique_count_dict = {str(row[0]): row[1] for row in results}

        


@app.route('/data-analysis', methods=['GET'])
def data_analysis():
    try:
        start_date_str = request.args.get('startDate')
        end_date_str = request.args.get('endDate')
        
        if not start_date_str or not end_date_str:
            return jsonify({'error': 'startDate and endDate are required'}), 400

        conn=sqlite3.connect("EntryLog.db")
        cursor= conn.cursor()
        query = 'SELECT DATE(Timestamp_Entry) AS date, COUNT(DISTINCT id) AS unique_count FROM KNOWNDB WHERE DATE(Timestamp_Entry) BETWEEN ? AND ? GROUP BY DATE(Timestamp_Entry)' 
        cursor.execute(query, (start_date_str, end_date_str))
        results = cursor.fetchall()
        print("known data results:  ", results)
        date_unique_count_dict = {str(row[0]): row[1] for row in results}

        return jsonify(date_unique_count_dict), 200
    except Exception as e:
        print("known data..")
        #error_logger.exception("Error occurred", exc_info=True)
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/unknown-images-by-date', methods=['GET'])
def unknown_images_by_date():
    global mydb
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()
        print("Unknown Date: ", date)

        try:
            conn = sqlite3.connect("EntryLog.db")
            cursor = conn.cursor()
            print("Fetching unknown images...")

            if not conn:
                return jsonify({"error": "Database connection failed"}), 500

            # Fetch images of unknown people for the specific date
            sql = 'SELECT DISTINCT Image_Tag FROM UNKNOWNDB WHERE DATE(Timestamp_entry) = ?'
            cursor.execute(sql, (date,))
            results = cursor.fetchall()
            
            if not results:
                return jsonify({"error": "No images found for this date"}), 404

            first_values = [item[0] for item in results]
            print("Image URLs: ", first_values) 
            image_data = []

            for image_url in first_values:
                # Fetch the image
                response = requests.get(image_url)
                if response.status_code == 200:
                    image = Image.open(BytesIO(response.content))
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    image_data.append(img_str)
                else: 
                    print(f"Error fetching image from {image_url}: {response.status_code}")
                    continue  # Skip this image and move to the next one

            conn.close()
            return jsonify(image_data), 200

        except sqlite3.OperationalError as e:
            print(f"Database is locked: {e}")
            return jsonify({'error': 'Database is locked, try again later.'}), 500
        
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({'error': 'SQLite error occurred'}), 500
        
        finally:
            if conn:
                conn.close()

    except Exception as e:
        print("Unknown images error: ", e)
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/known-images-by-date', methods=['GET'])
def known_images_by_date():
    try:
        date_str = request.args.get('date')
        
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        try:
            conn = sqlite3.connect("EntryLog.db")
            cursor = conn.cursor()
            print("Fetching known images...")

            if not conn:
                return jsonify({"error": "Database connection failed"}), 500

            # Fetch known people for the given date
            sql = 'SELECT DISTINCT id FROM KNOWNDB WHERE DATE(Timestamp_entry) = ?'
            cursor.execute(sql, (date,))
            results1 = cursor.fetchall()
            
            if not results1:
                return jsonify({"error": "No known people found for this date"}), 404

            first_values = [item[0] for item in results1]
            print("Known person IDs: ", first_values)
            
            conn1 = sqlite3.connect("Members.db")
            cursor1 = conn1.cursor()
            resultsss = []

            # Fetch the profile pictures of known people
            sql = 'SELECT Profile_Picture FROM Members WHERE uid IN ({})'.format(','.join(['?']*len(first_values)))
            cursor1.execute(sql, first_values)
            res = cursor1.fetchall()
            resultsss.append(res)

            first_values1 = [item[0] for sublist in resultsss for item in sublist]
            print("Profile picture URLs: ", first_values1) 
            image_data = []

            for image_url in first_values1:
                # Fetch the image
                response = requests.get(image_url)
                if response.status_code == 200:
                    image = Image.open(BytesIO(response.content))
                    buffered = BytesIO()
                    image.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    image_data.append(img_str)
                else: 
                    print(f"Error fetching image from {image_url}: {response.status_code}")
                    continue  # Skip this image and move to the next one

            conn1.close()
            conn.close()
            return jsonify(image_data), 200

        except sqlite3.OperationalError as e:
            print(f"Database is locked: {e}")
            return jsonify({'error': 'Database is locked, try again later.'}), 500
            
        except sqlite3.Error as e:
            print(f"SQLite error: {e}")
            return jsonify({'error': 'SQLite error occurred'}), 500
            
        finally:
            if conn:
                conn.close()

    except Exception as e:
        print("Known images error: ", e)
        traceback_str = traceback.format_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/images-by-date', methods=['GET'])
def get_images_by_date():
    date_str = request.args.get('date')
    filter_type = request.args.get('filter', 'all')  # Default to 'all'

    if not date_str:
        return jsonify({"error": "Date parameter is required"}), 400

    try:
        # Attempt to parse the date in 'YYYY-MM-DD' format
        date = datetime.strptime(date_str, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({"error": "Invalid date format. Please use YYYY-MM-DD."}), 400

    # Handle filter types
    if filter_type == 'known':
        images = get_known_images_by_date(date)
    elif filter_type == 'unknown':
        images = get_unknown_images_by_date(date)
    elif filter_type == 'all':
        images = get_all_images_by_date(date)
    else:
        return jsonify({"error": "Invalid filter type. Valid filters are 'known', 'unknown', or 'all'."}), 400

    return jsonify(images)

# @app.route('/names-by-date', methods=['GET'])
# def names_by_date():
#     global mydb
#     try:
#         date_str = request.args.get('date')
#         print("yesssss")
#         if not date_str:
#             raise ValueError("Missing 'date' parameter")

#         date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

#         try:
#                 conn=sqlite3.connect("EntryLog.db")
#                 cursor= conn.cursor()
#                 print("kkk")
            
#                 if not conn:
#                     return jsonify({"error": "Database connection failed"}), 500

#                 sql = 'SELECT DISTINCT id FROM KNOWNDB WHERE DATE(Timestamp_entry) = ?'
#                 cursor.execute(sql, (date,))
#                 results1 = cursor.fetchall()
#                 #conn.close()
#                 first_values = [item[0] for item in results1]
#                 #print("first values:  ", first_values)
#                 conn1=sqlite3.connect("Members.db")
#                 cursor1= conn1.cursor()
#                 resultsss=[]
            
#                 sql = 'SELECT Name FROM Members WHERE uid IN ({})'.format(','.join(['?']*len(first_values)))
#                 cursor1.execute(sql, first_values)
#                 res = cursor1.fetchall()
#                 resultsss.append(res)

#                 #print("unknown image results :  ", results)
#                 names = [item[0] for item in resultsss]
#                 print("NAMES::::   ", names) 
#                 conn.close()
#                 # Return the images in JSON format
#                 return jsonify(names), 200
                
#         except sqlite3.OperationalError as e:
#                 print(f"Database is locked: {e}")
#                 return jsonify({'error': 'Database is locked, try again later.'}), 500
            
#         except sqlite3.Error as e:
#                 print(f"SQLite error: {e}")
#                 return jsonify({'error': 'SQLite error occurred'}), 500
            
#         finally:
#                 # Ensure that the connection is closed
#                 if conn:
#                     conn.close()

#     except Exception as e:
#         print("names data..")
#         #error_logger.exception("Error occurred", exc_info=True)
#         traceback_str = traceback.format_exc()
#         return jsonify({"error": str(e)}), 500

@app.route('/names-by-date', methods=['GET'])
def names_by_date():
    try:
        date_str = request.args.get('date')
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        # Connect to databases
        conn = sqlite3.connect("EntryLog.db")
        conn1 = sqlite3.connect("Members.db")
        try:
            # Fetch distinct IDs for the given date
            cursor = conn.cursor()
            sql = 'SELECT DISTINCT id FROM KNOWNDB WHERE DATE(Timestamp_entry) = ?'
            cursor.execute(sql, (date,))
            results1 = cursor.fetchall()
            first_values = [item[0] for item in results1]

            if not first_values:
                return jsonify({"message": "No data found for the given date"}), 404

            # Fetch names using IDs
            cursor1 = conn1.cursor()
            sql = 'SELECT Name FROM Members WHERE uid IN ({})'.format(','.join(['?'] * len(first_values)))
            cursor1.execute(sql, first_values)
            res = cursor1.fetchall()
            names = [item[0] for item in res]

            return jsonify(names), 200
        except sqlite3.OperationalError as e:
            error_logger.error(f"Database is locked: {e}")
            return jsonify({'error': 'Database is locked, try again later.'}), 500
        except sqlite3.Error as e:
            error_logger.error(f"SQLite error: {e}")
            return jsonify({'error': 'SQLite error occurred'}), 500
        finally:
            # Ensure connections are closed
            if conn:
                conn.close()
            if conn1:
                conn1.close()
    except Exception as e:
        error_logger.exception("Error occurred", exc_info=True)
        return jsonify({"error": str(e)}), 500

@app.route("/timestamp-by-date", methods=['GET'])
def timestamp_date():
    try:
        # Get the date parameter from the request
        date_str = request.args.get('date')
        if not date_str:
            raise ValueError("Missing 'date' parameter")

        # Parse the date string into a datetime object
        date = pd.to_datetime(date_str, format='%Y-%m-%d').date()

        # Connect to the SQLite database
        conn = sqlite3.connect("EntryLog.db")
        cursor = conn.cursor()

        # Define the SQL query to get the max timestamp by date
        sql = '''
            SELECT MAX(Timestamp_Entry) 
            FROM KNOWNDB 
            WHERE DATE(Timestamp_Entry) = ? 
            GROUP BY id
        '''

        # Execute the query with the given date
        cursor.execute(sql, (date,))
        results = cursor.fetchall()

        # Log and return the results
        print("Query executed successfully. Results:", results)
        return jsonify(results), 200

    except sqlite3.OperationalError as e:
        print(f"Database error: {e}")
        return jsonify({'error': 'Database is locked, try again later.'}), 500

    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
        return jsonify({'error': 'An SQLite error occurred.'}), 500

    except ValueError as e:
        print(f"Value error: {e}")
        return jsonify({'error': str(e)}), 400

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return jsonify({'error': 'An unexpected error occurred.'}), 500

    finally:
        # Ensure the connection is closed properly
        try:
            if conn:
                conn.close()
                print("Database connection closed.")
        except Exception as e:
            print(f"Error closing database connection: {e}")
 
# Endpoint to get S3 videos list
@app.route('/videos', methods=['GET'])
def list_videos():
    start_date = request.args.get('start_date')
    start_time = request.args.get('start_time', '00:00')  # Default to '00:00' if not provided
    end_date = request.args.get('end_date')
    end_time = request.args.get('end_time', '23:59')  # Default to '23:59' if not provided

    print("Start Date:", start_date)
    print("Start Time:", start_time)
    print("End Date:", end_date)
    print("End Time:", end_time)

    try:
        if start_date and end_date:
            start_datetime = datetime.strptime(f"{start_date} {start_time}", '%Y-%m-%d %H:%M')
            end_datetime = datetime.strptime(f"{end_date} {end_time}", '%Y-%m-%d %H:%M')
        else:
            start_datetime, end_datetime = None, None

        s3_videos = get_s3_videos(start_datetime, end_datetime)
        return jsonify({"s3_videos": s3_videos})

    except Exception as e:
        print("Error in /videos endpoint:", str(e))
        return jsonify({"error": str(e)}), 500

# Function to retrieve and filter S3 videos
def get_s3_videos(start_datetime=None, end_datetime=None):
    try:
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET_NAME1)
        videos = []
        for obj in response.get('Contents', []):
            video_key = obj['Key']
            print(f"Processing file: {video_key}")

            if video_key.startswith("cam1_loc1_") and video_key.endswith(".mp4"):
                video_timestamp_str = video_key[len("cam1_loc1_"):-len(".mp4")]
                try:
                    video_datetime = datetime.strptime(video_timestamp_str, '%Y%m%d-%H%M%S')
                    if start_datetime and end_datetime:
                        if start_datetime <= video_datetime <= end_datetime:
                            videos.append(f"{S3_CLOUDFRONT_URL1}{video_key}")
                    else:
                        videos.append(f"{S3_CLOUDFRONT_URL1}{video_key}")
                except ValueError:
                    print(f"Invalid timestamp format: {video_key}")
                    continue

        return videos
    except NoCredentialsError:
        return {"error": "AWS credentials not found. Ensure your credentials are configured correctly."}
    except Exception as e:
        print("Error in get_s3_videos:", str(e))
        return {"error": str(e)}

@app.route('/fetchDetails', methods=['GET'])
def getDetails():
    try:
        name = request.args.get('name')
        print("1...", name)
 
        if not name:
            return jsonify({"error": "Name parameter is required"}), 400
 
        try:
            # Connect to the database
            conn = sqlite3.connect("Members.db")
            cursor = conn.cursor()
            sql = 'SELECT Mobile_Number, Membership, Age,Email, Blood_Group, Height, Weight, Address, Emergency_Contact_Name, Emergency_Contact_Number, Membership_start_date, Membership_end_date,Profile_Picture FROM Members WHERE Name = ?'
            cursor.execute(sql, (name,))
            results1 = cursor.fetchall()
            print("results.... ", results1)
            if not results1:
                return jsonify({"error": "No details found for the provided name"}), 404
 
            # Extract the first result (assuming the name is unique)
            result = results1[0]
            print("results.... ", result)
 
            # Convert profile picture to base64 (if applicable)
            profile_picture_base64 = None
            if result[9]:  # If Profile_Picture exists
                try:
                    with open(result[12], "rb") as img_file:  # Assuming it's a file path
                        profile_picture_base64 = base64.b64encode(img_file.read()).decode('utf-8')
                except Exception as e:
                    print(f"Error encoding profile picture: {e}")
           
            # Prepare the structured response
            result_dict = {
                "Mobile_Number": result[0],
                "Membership": result[1],
                "Age": result[2],
                "Email": result[3],
                "Blood_Group": result[4],
                "Height": result[5],
                "Weight": result[6],
                "Address": result[7],
                "Emergency_Contact_Name": result[8],
                "Emergency_Contact_Number": result[9],
                "Membership_start_date":result[10],
                "Membership_end_date": result[11],
                "Profile_Picture": profile_picture_base64  # Include base64 image data if available
            }
            print("result dic ", result_dict)
            return jsonify(result_dict), 200
 
        except sqlite3.OperationalError as e:
            print(f"SQLite OperationalError: {e}")
            return jsonify({'error': 'Database is locked, try again later.'}), 500
       
        except sqlite3.Error as e:
            print(f"SQLite Error: {e}")
            return jsonify({'error': 'SQLite error occurred'}), 500
       
        finally:
            # Ensure that the connection is closed
            if conn:
                conn.close()
 
    except Exception as e:
        print(f"Unexpected error: {e}")
        traceback_str = traceback.format_exc()
        print("Full Traceback:", traceback_str)  # Log the full traceback for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
