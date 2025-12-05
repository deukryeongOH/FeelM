import pandas as pd
from openai import OpenAI
import os
import time
import random

# GPU 사용 권장 (Colab 앱에서 실행)

API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

emotion_prompts = {
    '기쁨': '희망차고 활기찬 기쁨',
    '슬픔': '비극적이고 애절한 슬픔',
    '설렘': '사랑이 시작되는 로맨틱한 설렘',
    '공포': '긴장감 넘치고 오싹한 공포',
    '외로움': '고독하고 쓸쓸한 외로움'
}

data = []
TARGET_COUNT_PER_EMOTION = 1000

def generate_plots(emotion_key, emotion_desc, count):
    countries = ["한국", "일본", "미국"]
    selected_country = random.choice(countries)

    prompt = f"""
    영화 줄거리 데이터셋을 대량으로 구축 중이야.
    '{emotion_desc}'의 감정이 핵심 주제인 영화 줄거리를 {count}개 생성해줘.

    조건:
    1. 배경과 등장인물의 분위기를 {selected_country} 영화 스타일로 설정해줘.
    2. 줄거리는 2~3문장으로 구체적이어야 하며, 해당 감정이 잘 드러나야 함.
    3. 번호나 부가 설명 없이 오직 줄거리 텍스트만 한 줄에 하나씩 출력해.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.9
        )
        content = response.choices[0].message.content
        lines = [line.strip() for line in content.split('\n') if line.strip()]
        return lines
    except Exception as e:
        print(f"Error: {e}")
        return []

print("데이터 대량 생성 시작 (목표: 각 감정당 1000개)...")

for emotion, desc in emotion_prompts.items():
    current_count = 0
    while current_count < TARGET_COUNT_PER_EMOTION:
        batch_size = 25
        print(f"[{emotion}] ({desc}) 생성 중... ({current_count}/{TARGET_COUNT_PER_EMOTION})")

        plots = generate_plots(emotion, desc, batch_size)

        if not plots:
            time.sleep(5)
            continue

        for plot in plots:
            data.append({'plot': plot, 'label': emotion})
            current_count += 1

        time.sleep(0.5)

df = pd.DataFrame(data)
df.drop_duplicates(subset=['plot'], inplace=True)
df.to_csv("movie_emotions_train.csv", index=False, encoding='utf-8-sig')
print(f"총 {len(df)}개의 데이터가 'movie_emotions_train.csv'로 저장되었습니다.")