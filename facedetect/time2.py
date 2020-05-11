import threading
import time
import cv2
import time
n = 0;

while True:
    time.sleep(1) 
    n += 1
    print(n)
    if n == 15:
        break
    