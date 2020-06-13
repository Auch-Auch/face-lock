import pymongo


def getSettings():
    try:
        client = pymongo.MongoClient(
            "mongodb+srv://auch:123567@cluster0-solgr.mongodb.net/", )
        db = client["test"]
        collection = db["settings"]
        settings = collection.find_one()
        campath = settings["campath"]
        if campath == "0":
            campath = 0
        return campath
    except Exception as e:
        print(e)
