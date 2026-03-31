import json, urllib.request, sys

# rclone tokenini al
import re, os
conf_path = os.path.expandvars(r"%APPDATA%\rclone\rclone.conf")
with open(conf_path) as f:
    conf = f.read()
token_json = re.search(r'token\s*=\s*(\{.*\})', conf).group(1)
access_token = json.loads(token_json)["access_token"]

file_id = "1Szy882ShZNsIqPyxsYme1o-2PJphcxxL"
content = json.dumps({
    "version": "2.11.36",
    "dbVersion": 1,
    "apkUrl": "https://github.com/yunuscelik95/cordova_offline_survey/releases/download/v2.11.36/app-debug.apk",
    "driveApkUrl": "https://drive.usercontent.google.com/download?id=1B0weGC3e6YqSDEjRV8IexyU-12ZgdyU9&export=download&confirm=t",
    "description": "RESPONSES tablosu drop kaldirildi - buton aciklamalari korunur"
}, ensure_ascii=False)

data = content.encode("utf-8")
req = urllib.request.Request(
    f"https://www.googleapis.com/upload/drive/v3/files/{file_id}?uploadType=media",
    data=data, method="PATCH"
)
req.add_header("Authorization", "Bearer " + access_token)
req.add_header("Content-Type", "application/json")

try:
    with urllib.request.urlopen(req) as r:
        result = json.loads(r.read())
        print("OK:", result.get("name"), "id:", result.get("id"))
except urllib.error.HTTPError as e:
    print("HATA:", e.code, e.read().decode())
