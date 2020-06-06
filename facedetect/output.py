import cv2
import numpy as np
import os
import json
import datetime
import time
import requests as req
import asyncio
from websocket import create_connection
import pymongo
import settings

CAM_PATH = settings.CAMPATH
N_AUTH_ATTEMPTS = 5
PATH_DATA = 'faces/'


#ws = create_connection("ws://192.168.43.247:81")
# ws.send("ledon")


def getDate(type=""):
    if type == "time":
        return str(datetime.datetime.today().strftime("%H:%M:%S"))
    elif type == "day":
        return str(datetime.datetime.today().strftime("%Y-%m-%d"))
    elif type == "img":
        return str(datetime.datetime.today().strftime("%Y%m%d%H%M%S"))
    return str(datetime.datetime.today().strftime("%Y-%m-%d-%H.%M.%S"))


def getFaces():
    faces = []
    labels = []
    i = -1
    for root, dirs, files in os.walk(PATH_DATA):
        i += 1
        for name in files:
            faces.append(cv2.imread(root+'/'+name, cv2.IMREAD_GRAYSCALE))
            labels.append(i)
    return faces, labels


def pushPost(name, confidence, access):
    userData = ({
                "name": name,
                "confidence": confidence,
                "day": getDate("day"),
                "time": getDate("time"),
                "access": access,
                "imgName": getDate("img"),
                },)
    try:
        req.post('http://localhost:5000/api/posts', json=userData)
    except:
        print("Connection to server failed")


def getPutText(name, confidence, frame, x, y):
    if confidence < 80:
        text = 'Name: ' + name + ' confidence: ' + str(confidence)
        return cv2.putText(frame, text, (x, y),
                           cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 255, 0), 2)
    else:
        text = 'Name: ' + 'unknown' + ' confidence: ' + str(confidence)
        return cv2.putText(frame, text, (x, y),
                           cv2.FONT_HERSHEY_SIMPLEX, 1.5, (124, 10, 2), 3)


def verificationFace(confidence, name, img, x, y):
    global N_AUTH_ATTEMPTS, startTime
    if confidence <= 80:
        getPutText(name, confidence, img, x, y)
        if time.time() - startTime > 5 and N_AUTH_ATTEMPTS != 0:
            print("access")
            cv2.imwrite('images/' + getDate("img") + '.jpg', img)
            pushPost(name, confidence, True)
            startTime = startTime + 5
            N_AUTH_ATTEMPTS = 5
    else:
        getPutText(name, confidence, img, x, y)
        if time.time() - startTime > 5 and N_AUTH_ATTEMPTS != 0:
            print("No access")
            cv2.imwrite('images/' + getDate("img") + '.jpg', img)
            pushPost(name, confidence, False)
            startTime = startTime + 5
            N_AUTH_ATTEMPTS -= 1


def main():
    global cap, startTime
    cap = cv2.VideoCapture(int(CAM_PATH))
    names = os.listdir(PATH_DATA)
    faces, labels = getFaces()
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    face_recognizer = cv2.face.LBPHFaceRecognizer_create(1, 8, 8, 8, 80)
    face_recognizer.train(faces, np.array(labels))
    wasFace = False
    while(True):
        ret, img = cap.read()
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        if faces.__len__() != 0 and not(wasFace):
            startTime = time.time()
            wasFace = True
        elif faces.__len__() == 0 and wasFace:
            wasFace = False
            startTime = 0
        for (x, y, w, h) in faces:
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
            roiGray = gray[y:y+h, x:x+w]
            label = face_recognizer.predict(roiGray)
            verificationFace(round(label[1], 2), names[label[0]-1], img, x, y)
            if N_AUTH_ATTEMPTS == 0:
                return print('YOU ARE NOT EXIST')
        cv2.imshow('frame', img)
        cv2.waitKey(1)


main()
cap.release()
cv2.destroyAllWindows()
