Merged BuildBetter project with MailerSend SMTP backend and asset upload/storage.

Backend: backend/EmailApi
- API endpoints:
  - POST /api/contact  (send email via MailerSend SMTP)
  - POST /api/upload   (multipart/form-data file upload; saves to wwwroot/uploads)
  - GET  /api/assets   (list uploaded assets metadata)

Frontend:
- AssetsAdmin component at src/components/AssetsAdmin.tsx lets you upload and preview assets.
- The existing Contact component posts to {"import.meta.env.VITE_API_URL"} or http://localhost:5000 by default.

How to run:
1. Backend:
   cd backend/EmailApi
   dotnet restore
   dotnet run
2. Frontend:
   cd /mnt/data/merged_full_assets_project/buildbetter-showcase-main
   npm install
   npm run dev

Notes:
- Uploaded files are saved to backend/wwwroot/uploads and served statically at /uploads/{filename}.
- Metadata is kept in backend/uploads/metadata.json.
- Admin Log in details:
    - Username: MainAdmin
    - Password: MainAdmin@01   
