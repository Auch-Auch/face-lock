import os
import cv2


def getFaces():
    faces = []
    labels = []
    i = -1
    for root, dirs, files in os.walk('faces/'):
        i += 1
        for name in files:
            print(name)
            faces.append(cv2.imread(root+'/'+name, cv2.IMREAD_GRAYSCALE))
            labels.append(i)


print(getFaces())
