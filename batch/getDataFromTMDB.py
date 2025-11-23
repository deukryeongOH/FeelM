import requests
import pymysql

API_KEY = "21a66a7a9477c7c42b6fbefe99eda6f3"

conn = pymysql.connect(host='localhost', port=3306, user='root', password='0630', database='feelm', charset='utf8')
cursor = conn.cursor()


# 영화의 목록만 가져온다.
def fetch_movies():
    url = f"https://api.themoviedb.org/3/movie/popular?api_key={API_KEY}&language=ko"
    res = requests.get(url).json()
    return res['results']

# 영화 세부정도를 가져오는 메소드
def fetch_movie_details(movie_id):
    url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}&language=ko-KR&append_to_response=release_dates"
    try:
        res = requests.get(url).json()
        return res
    except:
        return None


def convert_certification_to_int(cert_str):
    if not cert_str:
        return 0 # 정보 없으면 0(전체) 또는 특정 값으로 처리

    # 공백 제거
    cert_str = str(cert_str).strip()

    # 1. 숫자로 된 문자열인 경우 ("12", "15", "18" 등) 바로 변환
    if cert_str.isdigit():
        return int(cert_str)

    # 2. 문자열 등급 매핑 (한국/미국 기준 통합)
    mapping = {
        'All': 0, 'ALL': 0, '전체관람가': 0, 'G': 0,
        'PG': 0,      # 부모 지도하에 전체 관람 가능
        'PG-13': 13,  # 13세 이상
        'R': 19,      # 청불 (한국 기준 19세로 매핑)
        'NC-17': 19,
        'Restricted screening': 19, # 제한상영가
        'Exempt': 0   # 등급 면제
    }

    # 매핑된 값이 있으면 반환, 없으면 0 반환
    return mapping.get(cert_str, 0)
def get_certification(movie_details, target_country='KR'):
    # 'release_dates' 키가 없거나 그 안에 'results'가 없으면 None 반환
    if 'release_dates' not in movie_details or 'results' not in movie_details['release_dates']:
        return None

    results = movie_details['release_dates']['results']

    # 1순위: 한국(KR) 검색
    for country_data in results:
        if country_data['iso_3166_1'] == target_country:
            for release in country_data['release_dates']:
                if release['certification']:
                    return release['certification']

    # 2순위: 미국(US) 검색
    for country_data in results:
        if country_data['iso_3166_1'] == 'US':
            for release in country_data['release_dates']:
                if release['certification']:
                    return release['certification']
    return None

def save_movie(movie_details):
    raw_certification = get_certification(movie_details)

    certification = convert_certification_to_int(raw_certification)

    sql = """
    INSERT IGNORE INTO Movie (id, title, plot, poster_url, rate, certification)
    VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        movie_details.get('id'),
        movie_details.get('title'),
        movie_details.get('overview'),
        movie_details.get('poster_path'),
        movie_details.get('vote_average'),
        certification
    ))

movies = fetch_movies()

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