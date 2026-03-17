from openai import OpenAI
import pymysql
# BERT 사용 x
# import torch
# import torch.nn.functional as F
# from transformers import AutoTokenizer, AutoModelForSequenceClassification
import re
import os

# BERT 모델
# BASE_PATH = "C:\\Users\\deukr\\FeelM\\Feelm-AI"
# MODEL_PATH = get_best_model_path(BASE_PATH)

# openai API 사용 부분 주석 처리
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

# device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
# print(f"Loading model from {MODEL_PATH} on {device}...")
#
# try:
#     tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
#     model = AutoModelForSequenceClassification.from_pretrained(MODEL_PATH)
#     model.to(device)
#     model.eval()
# except Exception as e:
#     print(f"모델 로드 실패: {e}")
#     print(f"경로 확인 필요: {MODEL_PATH} 안에 config.json 파일이 있는지 확인해주세요.")
#     print("LearningModel.py를 먼저 실행하여 모델을 학습시켜주세요.")
#     exit()

# local 일때
# conn = pymysql.connect(host='localhost', port=3306, user='root', password='0630', database='feelm', charset='utf8')

# Docker docker-compose에서 설정한 DB 이름, 호스트 가져옴
db_host = os.getenv("RDS_ENDPOINT", "localhost")
db_password = os.getenv("RDS_MASTER_PASSWORD", "0630")


def insert_initial_feels(cursor, conn):
    initial_feels = ['기쁨', '슬픔', '설렘', '공포', '외로움']
    sql = "INSERT IGNORE INTO feel (type) VALUES (%s)"
    data_to_insert = [(f,) for f in initial_feels]
    try:
        cursor.executemany(sql, data_to_insert)
        conn.commit()
    except Exception as e:
        print(f"Error inserting initial feels: {e}")
        conn.rollback()


def get_movies(cursor):
    cursor.execute("SELECT id, title, plot, genres, keywords FROM movie")
    return cursor.fetchall()

# openai API 호출 부분 주석 처리
def analyze_feel(title, plot, genres, keywords):

    prompt = f"""
        너는 영화 심리 치료사이자 전문 큐레이터 'Feelm AI'야.
        아래 영화 정보를 종합적으로 분석해서, 이 영화가 어떤 감정 상태인 사람에게 가장 필요한지 처방해줘.

        [분석 대상 영화]
        - 제목: {title}
        - 장르: {genres} (가장 중요한 기준)
        - 키워드: {keywords}
        - 줄거리: {plot}

        [판단 기준]
        1. 기쁨 (Happy):
           - 장르: 코미디, 액션, 판타지
           - 밝고 경쾌한 분위기.
           - 긍정적인 메시지를 전달하여 삶의 에너지를 주는 영화.

        2. 슬픔 (Sad):
           - 장르: 드라마, 멜로, 가족
           - 눈물을 흘리며 카타르시스를 느낄 수 있는 영화.
           - 위로를 주면서도 너무 어둡지 않고, 기분 전환이 가능한 유쾌하거나 가벼운 터치가 있는 영화.

        3. 설렘 (Flutter):
           - 장르: 로맨스, 로맨틱 코미디
           - 사랑의 설렘과 감동을 담은 긍정적인 영화.
           - 풋풋한 첫사랑 이야기거나 보기만 해도 미소가 지어지는 달콤한 로맨스.
           - **주의:** 액션/모험 영화에 나오는 서브 로맨스는 '설렘'으로 분류하지 마시오.

        4. 공포 (Fear):
           - 장르: 공포, 스릴러
           - 등골이 오싹해지는 공포/스릴러 영화 (이열치열).
           - 또는, 반대로 불안한 마음을 아주 편안하게 잠재워주는 긍정적이고 안전한 힐링 영화.

        5. 외로움 (Lonely):
           - "나만 혼자가 아니구나"라는 공감을 주는 영화.
           - 혼자라는 느낌을 해소해주거나, 비슷한 고독의 감정을 섬세하게 다루는 영화.

        [제약 사항]
        - **줄거리에 '사랑', '재회' 같은 단어가 있더라도, 장르가 '액션'이나 '모험'이면 '기쁨'으로 분류해.**
        - 반드시 ['기쁨', '슬픔', '설렘', '공포', '외로움'] 중에서 가장 적합한 것만 골라야 해.
        - 부가 설명 없이 오직 단어만 출력해.

        출력 예시: 기쁨
        """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3 # 창의성 낮춤 (포맷 준수 위해)
        )

        # v1.0 이상 문법 대응 (.content)
        content = response.choices[0].message.content

        # 콤마 기준으로 자르고 공백 제거
        emotions = [e.strip() for e in content.split(',')]

        # 유효한 감정만 필터링 (이상한 단어 방지)
        valid_feels = {'기쁨', '슬픔', '설렘', '공포', '외로움'}
        return [e for e in emotions if e in valid_feels]

    except Exception as e:
        print(f"OpenAI API 호출 중 에러: {e}")
        return []

# FeelBERT 모델 사용 부분 추가
# def analyze_feel_bert(plot):
#     inputs = tokenizer(
#         plot,
#         return_tensors="pt",
#         truncation=True,
#         max_length=128,
#         padding=True
#     ).to(device)
#
#     with torch.no_grad():
#         outputs = model(**inputs)
#         logits = outputs.logits
#         probs = F.softmax(logits, dim=1)
#
#     top1_probs, top1_index = torch.topk(probs, 1)
#
#     id2label = model.config.id2label
#     results = id2label[top1_index.item()]
#
#     return [results]

def save_tags(movie_id, feels):
    if not feels:
        return
    conn = pymysql.connect(host=db_host, port=3306, user='root', password=db_password, database='feelm', charset='utf8')
    cursor = conn.cursor()

    # INSERT IGNORE를 사용하여 중복 태그 에러 방지
    sql = """
    INSERT IGNORE INTO movie_feel_tag (movie_id, feel_id)
    SELECT %s, id FROM feel WHERE type = %s
    """
    try:
        for feel in feels:
            cursor.execute(sql, (movie_id, feel))
            conn.commit() # 영화 하나 끝날 때마다 커밋 (중간에 멈춰도 저장되게)
    except Exception as e:
        print(f"영화 ID {movie_id} 태그 저장 실패: {e}")
        conn.rollback()

# 영화 한 편씩 처리하는 워커 함수
def process_single_movie(row):
    movie_id, title, plot, genres, keywords = row[0], row[1], row[2], row[3] if row[3] else "", row[4] if row[4] else ""
    if not plot or len(plot) < 10: return

    feels = analyze_feel(title, plot, genres, keywords)
    if feels:
        save_tags(movie_id, feels)
        print(f"Saved: {title} -> {feels}")

def main():
    conn = pymysql.connect(host=db_host, port=3306, user='root', password=db_password, database='feelm', charset='utf8')
    cursor = conn.cursor()

    try:
        insert_initial_feels(cursor, conn)
        movies = get_movies(cursor)

        print(f"총 {len(movies)}개의 영화 분석 시작...")

        # 병렬 처리: 5개 스레드로 동시에 OpenAI 호출
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            executor.map(process_single_movie, movies)
    finally:
        cursor.close()
        conn.close()
        print("분석 완료")

if __name__ == "__main__":
    main()