# SwiftPick API — Backend

**School Pickup & Bus Tracking System with AI Dismissal Agent**

## Requirements
- PHP 7.4+ (Laragon)
- MySQL 5.7+
- Apache with mod_rewrite

## Setup

1. **Database**: Import `migrations/001_create_tables.sql` into MySQL
2. **Config**: Update `config/database.php` with your credentials
3. **Laragon**: Place this folder inside `C:\laragon\www\swiftpick-api`
4. **Test**: Visit `http://localhost/swiftpick-api/api`

## Default Admin
- **Email**: `admin@swiftpick.com`
- **Password**: `Admin@123`

## API Base URL
```
http://localhost/swiftpick-api/api
```

## Authentication
All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

## Endpoints Summary

| Group | Prefix | Role |
|-------|--------|------|
| Auth | `/api/auth/*` | Public |
| Parent | `/api/parent/*` | parent |
| Teacher | `/api/teacher/*` | teacher |
| Driver | `/api/driver/*` | driver |
| Admin | `/api/admin/*` | admin |
