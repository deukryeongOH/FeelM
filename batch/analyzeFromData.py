from openai import OpenAI
import pymysql
import re
import os

API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=API_KEY)

conn = pymysql.connect(host='localhost', port=3306, user='root', password='0630', database='feelm', charset='utf8')
cursor = conn.cursor()

def insert_initial_feels():
    initial_feels = ['기쁨', '슬픔', '설렘']
    sql = "INSERT IGNORE INTO Feel (type) VALUES (%s)"
    data_to_insert = [(f,) for f in initial_feels]
    try:
        cursor.executemany(sql, data_to_insert)
        conn.commit()
    except Exception as e:
        print(f"초기 감정 데이터 입력 실패: {e}")
        conn.rollback()


def get_movies():
    # 이미 태그 작업이 완료된 영화는 제외하고 가져오는 로직이 있으면 더 좋습니다.
    # 일단은 전체 조회
    cursor.execute("SELECT id, plot FROM Movie")
    return cursor.fetchall()

def analyze_feel(plot):
    prompt = f"""
        너는 영화 감정 분석가야. 아래 줄거리를 읽고 ['기쁨', '슬픔', '설렘'] 중에서 가장 적합한 감정 2개를 골라줘.
        부가적인 설명 없이 오직 단어 2개만 콤마(,)로 구분해서 출력해.

        줄거리: {plot}
        출력 예시: 기쁨, 설렘
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
        valid_feels = {'기쁨', '슬픔', '설렘'}
        return [e for e in emotions if e in valid_feels]

    except Exception as e:
        print(f"OpenAI API 호출 중 에러: {e}")
        return []

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

print(f"총 {len(movies)}개의 영화 분석 시작...")

for movie_id, plot in movies:
    # 줄거리가 너무 짧거나 없으면 건너뛰기
    if not plot or len(plot) < 10:
        continue

    print(f"분석 중: Movie ID {movie_id}")

    feels = analyze_feel(plot)

    if feels:
        save_tags(movie_id, feels)
        print(f"  -> 결과: {feels}")
    else:
        print("  -> 감정 추출 실패 또는 유효하지 않은 응답")

cursor.close()
conn.close()
print("분석 완료")