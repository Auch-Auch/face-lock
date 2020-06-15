import os
import numpy as np
import cv2
import requests

CAMPATH = 'http://192.168.1.3:8080/video'
USERS_URL = "http://10.10.10.2:4000/users/"


name = input('Enter your name:')
if not os.path.exists('faces'):
    os.mkdir('faces')
os.mkdir('faces/'+name)
print(name+' folder created!')
path = 'faces/'+name

face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
cap = cv2.VideoCapture(0)
for i in range(1, 10):
    print('Take picture '+str(i) + ' and press space')
    while(True):

        ret, img = cap.read()
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.1, 5)

        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
            roi_color = img[y:y+h, x:x+w]
            roi_gray = gray[y:y+h, x:x+w]

        cv2.imshow('frame', img)

        if cv2.waitKey(1) & 0xFF == ord(' '):
            roi_gray = cv2.resize(roi_gray, (100, 100))
            cv2.imwrite(path+'/'+str(i)+'.jpg', roi_gray)
            break


def create_new_user(name):
    data = ({
        'name': name
    })
    try:
        requests.post('http://10.10.10.2:4000/api/users', json=data)
    except:
        print("Connection to server failed")


create_new_user(name)
cap.release()
cv2.destroyAllWindows()
