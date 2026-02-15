# 1. 빌드 단계 (Node.js 사용)
FROM node:20-alpine as builder
WORKDIR /app

# 패키지 파일 복사 및 설치
COPY package.json package-lock.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build
# (주의: 만약 Vite가 아니라 CRA라면 'npm run build' 결과가 /app/build에 생깁니다.
#  Vite는 /app/dist 입니다. 아래에서 경로를 확인하세요.)

# 2. 실행 단계 (Nginx 사용)
FROM nginx:alpine

# Nginx 설정 덮어쓰기
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 결과물을 Nginx 폴더로 복사
# (Vite면 /app/dist, CRA면 /app/build 입니다. 보통 요즘은 dist입니다.)
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 80번 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]