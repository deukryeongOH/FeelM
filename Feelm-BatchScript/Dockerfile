FROM python:3.9-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

RUN pip install --no-cache-dir flask requests pymysql openai

COPY getDataFromTMDB.py .
COPY analyzeFromData.py .
COPY app.py .

CMD ["python", "app.py"]