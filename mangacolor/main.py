from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import cv2
import os
import json
from PIL import Image
import pickle
from detectron2.engine import DefaultPredictor
from colorizator import MangaColorizator
import random
import string
from inference import colorize_images, colorize_single_image

app = Flask(__name__)
CORS(app)

IMAGE_DIR = 'coloured/'

# @app.route('/predict', methods=['POST'])
# def predict():
#    with open('cfg.pickle', "rb") as f:
#        cfg = pickle.load(f)
#    cfg.merge_from_file("faster_rcnn_R_101_C4_3x.yaml")
#    # Check if the POST request has an image file
#    print(request.files.to_dict())
#    if 'file' not in request.files:
#        return jsonify({'error': 'No image found'})
#
#    # Read the image file from the POST request
#    image_file = request.files['file']
#    image_path = "temp_image.jpg"
#    image_file.save(image_path)
#    cfg_clone = cfg
#    cfg_clone.MODEL.WEIGHTS = os.path.join(cfg.OUTPUT_DIR, "model_final.pth")
#    cfg_clone.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.95
#    # Initialize the predictor with the cloned cfg
#    predictor_clone = DefaultPredictor(cfg_clone)
#    # Perform inference on the input image
#    img = cv2.imread(image_path)
#    outputs = predictor_clone(img)
#    return jsonify({'result_coords': outputs["instances"].get("pred_boxes")
#                    .tensor.cpu().tolist()})


@app.route('/colour', methods=['POST'])
def colour():
    device = 'cpu'
    generator = 'networks/generator.zip'
    extractor = 'networks/extractor.py'
    path = 'colourinput.jpg'
    size = 1056
    denoiser_sigma = 24
    denoiser = True
    print(request.files.to_dict())
    if 'file' not in request.files:
        print(request.files.to_dict())
        return jsonify({'error': 'No image found'})

    # Read the image file from the POST request
    image_file = request.files['file']
    path = "colourinput.jpg"
    image_file.save(path)

    colorizer = MangaColorizator(device, generator, extractor)

    if os.path.isdir(path):
        colorization_path = os.path.join(path, 'colorization')
        if not os.path.exists(colorization_path):
            os.makedirs(colorization_path)

        colorize_images(colorization_path, colorizer, path,
                        size, denoiser, denoiser_sigma)

    elif os.path.isfile(path):

        split = os.path.splitext(path)

        if split[1].lower() in ('.jpg', '.png', ',jpeg'):
            new_file_name = ''.join(random.choices(
                string.ascii_lowercase + string.digits, k=8))+'.jpg'
            new_image_path = 'coloured/' + new_file_name

            colorize_single_image(
                path, new_image_path, colorizer, size, denoiser, denoiser_sigma)
        else:
            print('Wrong format')
    else:
        print('Wrg path')
    return jsonify({'message': new_file_name}), 200


@app.route('/getimg/<image_name>', methods=['GET'])
def get_image(image_name):
    image_path = os.path.join(IMAGE_DIR, image_name)

    if not os.path.exists(image_path):
        return "Error: Image not found.", 404

    # Send the image file as a response
    return send_from_directory(IMAGE_DIR, image_name)


@app.route('/getdefaultpages/<book>', methods=['GET'])
def readdefault(book):
    try:
        if os.path.exists('defaultpages.json'):
            # Read existing data from 'defaultpages.json'
            with open("defaultpages.json", 'r') as f:
                existing_data = json.load(f)
            print(existing_data[book])
        return jsonify({'bookpages': existing_data[book]}), 200
    except Exception as e:
        print(jsonify({'error': str(e)}))
        return jsonify({'error': str(e)}), 500


@app.route('/read', methods=['GET'])
def read_file():
    try:
        if os.path.exists('data.json'):
            return send_file('data.json', as_attachment=True)
        else:
            return jsonify({'message': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/crop_image', methods=['POST'])
def crop_image():
    # Check if request contains an image file and coordinates
    if 'image' not in request.files or 'coordinates' not in request.form:
        return jsonify({'error': 'Image file and coordinates are required'}), 400

    # Get the image file and coordinates from the request
    image_file = request.files['image']
    coordinates_str = request.form['coordinates']

    # Convert coordinates string to a list of integers
    coordinates = [int(round(eval(coord))) for coord in coordinates_str.split(',')]
    print(coordinates)
    if len(coordinates) != 4:
        return jsonify({'error': 'Coordinates should have 4 values: x1, y1, x2, y2'}), 400

    # Open the image using PIL (Python Imaging Library)
    image = Image.open(image_file)

    # Crop the image using the provided coordinates
    cropped_image = image.crop(coordinates)

    # Generate a unique filename for the cropped image

    new_file_name = ''.join(random.choices(
                string.ascii_lowercase + string.digits, k=8))+'.jpg'
    cropped_filename = 'coloured/' + new_file_name


    # Save the cropped image to the server
    cropped_image.save(cropped_filename)

    # Return the name of the cropped image file
    return jsonify({'message': new_file_name}), 200


if __name__ == '__main__':
    app.run(debug=True, port=5001)
