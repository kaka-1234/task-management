# Hướng Dẫn Chạy Dự Án Personal Task Manager (TaskApi + task-client)

## 0. Yêu Cầu

- .NET SDK 8+
- Node.js 18+
- MySQL 8 hoặc Docker

## 1. Clone Dự Án

git clone <link-repo-của-bạn>

## 2. Khởi Tạo MySQL (dùng Docker)

docker run -d --name mysql-task -e MYSQL_ROOT_PASSWORD=123456 -e MYSQL_DATABASE=taskdb -p 3306:3306 mysql:8.0

## 3. Chạy Backend (TaskApi)

cd TaskApi
dotnet restore

- Mở file appsettings.json và sửa chuỗi kết nối:
  "ConnectionStrings": { "Default": "server=localhost;port=3306;database=taskdb;user=root;password=123456" }
- Nếu chưa có EF tool:
  dotnet tool install --global dotnet-ef
- Tạo migration:
  dotnet ef migrations add Init
- Cập nhật database:
  dotnet ef database update
- Chạy Web API:
  dotnet run
- Ghi lại port backend (ví dụ http://localhost:5120)

## 4. Chạy Frontend (task-client)

cd task-client
npm install

- Tạo file .env.local:
  VITE_API_BASE_URL=http://localhost:5120/api (port backend đã ghi lại trước đó)
- Chạy frontend:
  npm run dev
