from openai import OpenAI
import pymysql
import torch
import torch.nn.functional as F
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import os

MODEL_PATH = "C:\\Users\\deukr\\Feelm-AI"

# openai API 사용 부분 주석 처리
# API_KEY = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=API_KEY)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Loading model from {MODEL_PATH} on {device}...")

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
    model.to(device)
    model.eval()
except Exception as e:
    print(f"모델 로드 실패: {e}")
    print("train_bert.py를 먼저 실행하여 모델을 학습시켜주세요.")
    exit()

conn = pymysql.connect(host='localhost', port=3306, user='root', password='0630', database='feelm', charset='utf8')
cursor = conn.cursor()

def insert_initial_feels():
    initial_feels = ['기쁨', '슬픔', '설렘', '공포', '외로움']
    sql = "INSERT IGNORE INTO Feel (type) VALUES (%s)"
    data_to_insert = [(f,) for f in initial_feels]
    try:
        cursor.executemany(sql, data_to_insert)
        conn.commit()
    except Exception as e:
        print(f"Error inserting initial feels: {e}")
        conn.rollback()


def get_movies():
    cursor.execute("SELECT id, plot FROM Movie")
    return cursor.fetchall()

# openai API 호출 부분 주석 처리
# def analyze_feel(plot):
#     prompt = f"""
#         너는 영화 감정 분석가야. 아래 줄거리를 읽고 ['기쁨', '슬픔', '설렘'] 중에서 가장 적합한 감정 2개를 골라줘.
#         부가적인 설명 없이 오직 단어 2개만 콤마(,)로 구분해서 출력해.

#         줄거리: {plot}
#         출력 예시: 기쁨, 설렘
#         """
#     try:
#         response = client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             temperature=0.3 # 창의성 낮춤 (포맷 준수 위해)
#         )

#         # v1.0 이상 문법 대응 (.content)
#         content = response.choices[0].message.content

#         # 콤마 기준으로 자르고 공백 제거
#         emotions = [e.strip() for e in content.split(',')]

#         # 유효한 감정만 필터링 (이상한 단어 방지)
#         valid_feels = {'기쁨', '슬픔', '설렘'}
#         return [e for e in emotions if e in valid_feels]

#     except Exception as e:
#         print(f"OpenAI API 호출 중 에러: {e}")
#         return []

# FeelBERT 모델 사용 부분 추가
def analyze_feel_bert(plot):
    inputs = tokenizer(
        plot, 
        return_tensors="pt", 
        truncation=True, 
        max_length=128, 
        padding=True
    ).to(device)

    with torch.no_grad():
        outputs = model(**inputs)
        logits = outputs.logits
        probs = F.softmax(logits, dim=1)
    
    top1_probs, top1_index = torch.topk(probs, 1)
    
    id2label = model.config.id2label
    results = id2label[top1_index.item()]
    
    return [results]

def save_tags(movie_id, feels):
    if not feels:
        return

    # INSERT IGNORE를 사용하여 중복 태그 에러 방지
    sql = """
    INSERT IGNORE INTO Movie_Feel_Tag (movie_id, feel_id)
    SELECT %s, id FROM Feel WHERE type = %s
    """
    try:
        for feel in feels:
            cursor.execute(sql, (movie_id, feel))
            conn.commit() # 영화 하나 끝날 때마다 커밋 (중간에 멈춰도 저장되게)
    except Exception as e:
        print(f"영화 ID {movie_id} 태그 저장 실패: {e}")
        conn.rollback()


insert_initial_feels()
movies = get_movies()

print(f"총 {len(movies)}개의 영화 분석 시작 (BERT 모델 사용)...")

for movie_id, plot in movies:
    # 줄거리가 너무 짧거나 없으면 건너뛰기
    if not plot or len(plot) < 10:
        continue

    print(f"분석 중: Movie ID {movie_id}")

    feels = analyze_feel_bert(plot)

    try:
        if feels:
            save_tags(movie_id, feels)
            print(f"  -> 결과: {feels}")
        else:
            print("  -> 감정 추출 실패 또는 유효하지 않은 응답")
    except Exception as e:
        print(f"  -> 에러 발생: {e}")

cursor.close()
conn.close()
print("분석 완료")