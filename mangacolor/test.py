from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import os
import json
import pickle
from detectron2.engine import DefaultPredictor
from colorizator import MangaColorizator
from inference import colorize_images, colorize_single_image

device = 'cpu'
generator = 'networks/generator.zip'
extractor = 'networks/extractor.py'
path = 'colourinput.jpg'
size = 576
denoiser_sigma = 24
denoiser = True

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
        new_image_path = split[0] + '_colorized' + '.png'

        colorize_single_image(
            path, new_image_path, colorizer,  size, denoiser, denoiser_sigma)
    else:
        print('Wrong format')
