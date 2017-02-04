import requests
import json
import codecs

url = "http://ws.audioscrobbler.com/2.0/?method=user.getlovedtracks&user=orggg&api_key=5275ac1e04b48394d83abd58eccc0cce&format=json&limit=1000"

response = requests.get(url)

if not response.ok:
    response.raise_for_status()
    exit()

reader = codecs.getreader("utf-8")
jData = response.json()

for track in jData["lovedtracks"]["track"]:
    #print(str(track))
    print(track["artist"]["name"] + " - " + track["name"])

