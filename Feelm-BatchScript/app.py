from flask import Flask, jsonify
import subprocess
import sys
import os

app = Flask(__name__)

def run_script(script_name):
    try:
        result = subprocess.run([sys.executable, script_name],
            capture_output = True,
            text = True,
            check = True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr
    except Exception as e:
        return False, str(e)


@app.route('/run-fetch', methods = ['POST'])
def run_fetch():
    print("데이터 수집 중..")
    success, output = run_script("getDataFromTMDB.py")

    if success:
        return jsonify({"status": "success", "message": "수집 완료", "log": output}), 200
    else:
        return jsonify({"status": "error", "message": "수집 실패", "log": output}), 500

@app.route('/run-analyze', methods = ['POST'])
def run_analyze():
    print("데이터 분석 중..")
    success, output = run_script("analyzeFromData.py")

    if success:
        return jsonify({"status": "success", "message": "분석 완료", "log": output}), 200
    else:
        return jsonify({"status": "error", "message": "분석 실패", "log": output}), 500

if __name__ == '__main__':
    # 외부 접속 허용, 포트 5000
    app.run(host = '0.0.0.0', port = 5000)