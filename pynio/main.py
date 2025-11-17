from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import os
import json
import pickle
from detectron2.engine import DefaultPredictor
#from manga.colorizator import MangaColorizator
#from manga.inference import colorize_images, colorize_single_image

app = Flask(__name__)
CORS(app)


@app.route('/predict', methods=['POST'])
def predict():
    with open('cfg.pickle', "rb") as f:
        cfg = pickle.load(f)
    cfg.merge_from_file("faster_rcnn_R_101_C4_3x.yaml")
    # Check if the POST request has an image file
    print(request.files.to_dict())
    if 'file' not in request.files:
        return jsonify({'error': 'No image found'})

    # Read the image file from the POST request
    image_file = request.files['file']
    image_path = "temp_image.jpg"
    image_file.save(image_path)
    cfg_clone = cfg
    cfg_clone.MODEL.WEIGHTS = os.path.join(cfg.OUTPUT_DIR, "model_final.pth")
    cfg_clone.MODEL.ROI_HEADS.SCORE_THRESH_TEST = 0.95
    # Initialize the predictor with the cloned cfg
    predictor_clone = DefaultPredictor(cfg_clone)
    # Perform inference on the input image
    img = cv2.imread(image_path)
    outputs = predictor_clone(img)
    return jsonify({'result_coords': outputs["instances"].get("pred_boxes")
                    .tensor.cpu().tolist()})


#@app.route('/colour', methods=['GET'])
#def colour():
#    # parser = argparse.ArgumentParser()
#    # parser.add_argument("-p", "--path", required=True)
#    # parser.add_argument("-gen", "--generator",
#    #                    default='networks/generator.zip')
#    # parser.add_argument("-ext", "--extractor",
#    #                    default='networks/extractor.pth')
#    # parser.add_argument('-g', '--gpu', dest='gpu', action='store_true')
#    # parser.add_argument('-nd', '--no_denoise',
#    #                    dest='denoiser', action='store_false')
#    # parser.add_argument("-ds", "--denoiser_sigma", type=int, default=25)
#    # parser.add_argument("-s", "--size", type=int, default=576)
#    # parser.set_defaults(gpu=False)
#    # parser.set_defaults(denoiser=True)
#
#    device = 'cpu'
#    generator = 'manga/networks/generator.zip'
#    extractor = 'manga/networks/extractor.py'
#    path = 'colourinput'
#    size = 576
#    denoiser_sigma = 24
#    denoiser = True
#
#    colorizer = MangaColorizator(device, generator, extractor)
#
#    if os.path.isdir(path):
#        colorization_path = os.path.join(path, 'colorization')
#        if not os.path.exists(colorization_path):
#            os.makedirs(colorization_path)
#
#        colorize_images(colorization_path, colorizer, path,
#                        size, denoiser, denoiser_sigma)
#
#    elif os.path.isfile(path):
#
#        split = os.path.splitext(path)
#
#        if split[1].lower() in ('.jpg', '.png', ',jpeg'):
#            new_image_path = split[0] + '_colorized' + '.png'
#
#            colorize_single_image(
#                path, new_image_path, colorizer,  path, size, denoiser, denoiser_sigma)
#        else:
#            print('Wrong format')
#    else:
#        print('Wrong path')
#    return jsonify({'message': 'Data written to file successfully'}), 200


@app.route('/write', methods=['POST'])
def write_to_file():
    try:
        if os.path.exists('data.json'):
            # Read existing data from 'data.json'
            with open("data.json", 'r') as f:
                existing_data = json.load(f)
            # Update existing_data with data from add
            print(request.data.decode('utf-8'))
            print(existing_data)
            data = eval(request.data.decode('utf-8'))
            existing_data.update(data)
        else:
            # If 'data.json' doesn't exist, initialize with 'add' data
            data = request.data
            data = {"work": data}
            existing_data = data
        # Write the updated data (existing_data + add) back to 'data.json'
        with open("data.json", 'w') as f:
            json.dump(existing_data, f)

        return jsonify({'message': 'Data written to file successfully'}), 200
    except Exception as e:
        print(str(e))
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


if __name__ == '__main__':
    app.run(debug=True)
