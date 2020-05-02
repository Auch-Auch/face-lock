import cv2
import numpy as np
import os
import json
import datetime
import time
import requests
<<<<<<< HEAD

N_AUTH_ATTEMPTS = 5
PATH_DATA='faces/'


def getDate():
        return str(datetime.datetime.today().strftime("%Y-%m-%d/%H.%M.%S"))
=======
from websocket import create_connection

N_AUTH_ATTEMPTS = 3
PATH_DATA='faces/'
#try:
#    ws = create_connection("ws://192.168.43.247:81")
#except:
#    print("Error: connnection to socket was failed")

def getDate():
        return str(datetime.datetime.today().strftime("%Y-%m-%d-%H.%M.%S"))
>>>>>>> first commit


def getFaces():
    faces = []
    labels = []
    i = -1
    for root, dirs, files in os.walk(PATH_DATA):
        i += 1
        for name in files:
            faces.append(cv2.imread(root+'/'+name,cv2.IMREAD_GRAYSCALE))
            labels.append(i)
    return faces, labels


<<<<<<< HEAD
def pushPost(name, confidance, access):
    userData = ({
                "name": name, 
                "confidance": confidance, 
                "time": getDate(), 
                "access": access
=======
def pushPost(name, confidence, access, img):
    userData = ({
                "name": name, 
                "confidence": confidence, 
                "time": getDate(), 
                "access": access,
>>>>>>> first commit
                },)
    try:
        requests.post('http://localhost:5000/api/posts', json=userData)
    except:
        print("Connection to server failed")

<<<<<<< HEAD

def getPutText(name, confidance, frame, x, y):
    if confidance < 90:
        text = 'Name: ' + name + ' confidance: ' + str(confidance)
        return cv2.putText(frame, text, (x, y), \
                            cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 255, 0), 2)
    else:
        text = 'Name: ' + 'unknown' + ' confidance: ' + str(confidance)
        return cv2.putText(frame, text, (x, y), \
                            cv2.FONT_HERSHEY_SIMPLEX, 1.5, (124, 10, 2), 3)


def verificationFace(confidance, name, img, x, y):
    global N_AUTH_ATTEMPTS, startTime
    if confidance < 90:
        getPutText(name, confidance, img, x, y)
        if time.time() - startTime > 5 and N_AUTH_ATTEMPTS != 0:
            print("access")
            cv2.imwrite('images/' + getDate() + '.jpg', img)
            pushPost(name, confidance, True)
            startTime = startTime + 5
            N_AUTH_ATTEMPTS = 5
    else:
        getPutText(name, confidance, img, x, y)
        if time.time() - startTime > 5 and N_AUTH_ATTEMPTS != 0:
            print("No access")
            cv2.imwrite('images/' + getDate() + '.jpg', img)
            pushPost(name, confidance, False)
            startTime = startTime + 5
=======
def getPutText(name, confidence, frame, x, y):
    confidencePercent = " {0}%".format(round(100 - confidence))
    cv2.putText(frame, getDate(), (10, 20), cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 0, 0), 2)
    if confidence < 80:
        text = 'Name: ' + name + ' confidence: ' + str(confidencePercent)
        return cv2.putText(frame, text, (x, y), \
                            cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 255, 0), 2)
    else:
        text = 'Name: ' + 'unknown' + ' confidence: ' + 'unknown'
        return cv2.putText(frame, text, (x, y), \
                            cv2.FONT_HERSHEY_PLAIN, 1.5, (0, 0, 255), 2)


def verificationFace(confidence, name, img, x, y, roiGray):
    global N_AUTH_ATTEMPTS, startTime
    date = str(datetime.datetime.today().strftime("%Y-%m-%d-%H.%M.%S"))
    if confidence < 80:
        getPutText(name, confidence, img, x, y)
        if time.time() - startTime > 2 and N_AUTH_ATTEMPTS != 0:
            print("access")
            cv2.imwrite('images/' + date + '.jpg', img)
            pushPost(name, confidence, True, date)
           # ws.send("ledon")
            startTime = startTime + 2
    else:
        getPutText(name, confidence, img, x, y)
        if time.time() - startTime > 2 and N_AUTH_ATTEMPTS != 0:
            print("No access")
            cv2.imwrite('images/' + date + '.jpg', img)
            pushPost(name, confidence, False, date)
            #ws.send('ledoff')
            startTime = startTime + 2
>>>>>>> first commit
            N_AUTH_ATTEMPTS -= 1


def main():
    global cap, startTime
<<<<<<< HEAD
    cap = cv2.VideoCapture(0)
    names=os.listdir(PATH_DATA)
    faces, labels = getFaces()
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
=======
    cap = cv2.VideoCapture('http://192.168.1.3:8080/video')
    names=os.listdir(PATH_DATA)
    faces, labels = getFaces()
    face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
    face_recognizer = cv2.face.LBPHFaceRecognizer_create(1,8,8,8, 100)
>>>>>>> first commit
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
<<<<<<< HEAD
=======
            #ws.send("ledoff")
>>>>>>> first commit
            startTime = 0
        for (x, y, w, h) in faces:
            cv2.rectangle(img,(x, y), (x+w, y+h), (255, 0, 0), 2)
            roiGray = gray[y:y+h, x:x+w]
            label = face_recognizer.predict(roiGray)
<<<<<<< HEAD
            verificationFace(round(label[1], 2), names[label[0]-1], img, x, y)
            if N_AUTH_ATTEMPTS == 0:
                return print('YOU ARE NOT EXIST')
        cv2.imshow('frame',img)  
        cv2.waitKey(1)



main()
cap.release()
cv2.destroyAllWindows()
=======
            verificationFace(round(label[1], 2), names[label[0]-1], img, x, y, roiGray)
            if N_AUTH_ATTEMPTS == 0:
                return print('YOU ARE NOT EXIST')
        cv2.imshow('frame',img)
        cv2.waitKey(1)


main()
cap.release()
cv2.destroyAllWindows()

    
>>>>>>> first commit
