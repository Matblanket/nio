import requests

def send_image_to_server(image_path):
    url = 'http://localhost:5000/predict'
    files = {'image': open(image_path, 'rb')}
    response = requests.post(url, files=files)
    if response.status_code == 200:
        result = response.json()
        print('Server response:', result)
    else:
        print('Error occurred while sending image to server.')

if __name__ == '__main__':
    image_path = '30.png'  # Replace with the actual path to your image
    send_image_to_server(image_path)

