import requests
import pymysql
import random

API_KEY = "21a66a7a9477c7c42b6fbefe99eda6f3"

conn = pymysql.connect(host='localhost', port=3306, user='root', password='0630', database='feelm', charset='utf8')
cursor = conn.cursor()


# 영화 데이터의 다양성을 높이기 위해 페이지와 카테고리 인자로 받음
def fetch_movies(page, category='popular'):
    url = f"https://api.themoviedb.org/3/movie/{category}?api_key={API_KEY}&language=ko&page={page}"
    res = requests.get(url).json()
    return res.get('results', [])

# 영화 세부정도를 가져오는 메소드
def fetch_movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=ko-KR&append_to_response=release_dates"

    try:
        res = requests.get(url).json()
        return res
    except:
        return None

# 데이터의 시청연령 부분을 나이로 변환
def convert_certification_to_int(cert_str):
    if not cert_str:
        return 0 # 정보 없으면 0(전체) 또는 특정 값으로 처리

    # 공백 제거
    cert_str = str(cert_str).strip()

    # 숫자로 된 문자열인 경우 ("12", "15", "18" 등) 바로 변환
    if cert_str.isdigit():
        return int(cert_str)

    # 문자열 등급 매핑 (한국/미국 기준 통합)
    mapping = {
        'All': 0, 'ALL': 0, '전체관람가': 0, 'G': 0,
        'PG': 0,      # 전체
        'PG-13': 13,  # 13세 이상
        'R': 19,      # 청불 19세
        'NC-17': 19,
        'Restricted screening': 19, # 제한상영가
        'Exempt': 0   # 등급 면제
    }

    # 매핑된 값이 있으면 반환, 없으면 0 반환
    return mapping.get(cert_str, 0)

# 시청 연령 데이터로부터 받음
def get_certification(movie_details, target_country='KR'):
    if 'release_dates' not in movie_details or 'results' not in movie_details['release_dates']:
        return None

    results = movie_details['release_dates']['results']

    # 한국(KR) 검색
    for country_data in results:
        if country_data['iso_3166_1'] == target_country:
            for release in country_data['release_dates']:
                if release['certification']:
                    return release['certification']

    # 미국(US) 검색
    for country_data in results:
        if country_data['iso_3166_1'] == 'US':
            for release in country_data['release_dates']:
                if release['certification']:
                    return release['certification']
    return None

# 영화 데이터를 Movie 테이블에 저장
def save_movie(movie_details):
    raw_certification = get_certification(movie_details)

    certification = convert_certification_to_int(raw_certification)


    row_rate = movie_details.get('vote_average', 0.0)
    rate = round(row_rate, 2)

    sql = """
    INSERT IGNORE INTO Movie (id, title, plot, poster_url, rate, certification)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        movie_details.get('id'),
        movie_details.get('title'),
        movie_details.get('overview'),
        movie_details.get('poster_path'),
        rate,
        certification
    ))

for page in range(1, 3):
    movies = fetch_movies(page, 'popular')

    for m in movies:
        movie_id = m['id']

        details = fetch_movie_details(movie_id)
        if(details):
            try:
                save_movie(details)
                print(f"Saved: {details.get('title')}")
            except Exception as e:
                print(f"Error saving {movie_id}: {e}")
                conn.rollback()

for page in range(1, 3):
    movies = fetch_movies(page, 'top_rated')

    for m in movies:
        movie_id = m['id']

        details = fetch_movie_details(movie_id)
        if(details):
            try:
                save_movie(details)
                print(f"Saved: {details.get('title')}")
            except Exception as e:
                print(f"Error saving {movie_id}: {e}")
                conn.rollback()

random_pages = random.sample(range(10, 30), 2) # 10~30페이지 중 랜덤 2개 선택
for page in random_pages:
    movies = fetch_movies(page, 'popular')
    for m in movies:
        movie_id = m['id']

        details = fetch_movie_details(movie_id)
        if(details):
            try:
                save_movie(details)
                print(f"Saved: {details.get('title')}")
            except Exception as e:
                print(f"Error saving {movie_id}: {e}")
                conn.rollback()
conn.commit()
cursor.close()
conn.close()