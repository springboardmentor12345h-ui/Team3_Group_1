# Backend Implementation Guide

## New Features Added

### 1. Forgot Password Feature with Email Support

#### Setup Email Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your email service in `.env`:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   FRONTEND_URL=http://localhost:3000
   ```

**For Gmail Users:**
- Go to [Google Account Security](https://myaccount.google.com/security)
- Enable 2-Factor Authentication
- Generate an [App Password](https://myaccount.google.com/apppasswords)
- Use the app password in `EMAIL_PASSWORD`

#### API Endpoints

**1. Request Password Reset**
```
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

Response:
```json
{
  "msg": "Password reset link sent to your email"
}
```

**2. Reset Password**
```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email_link",
  "newPassword": "newPassword123",
  "confirmPassword": "newPassword123"
}
```

Response:
```json
{
  "msg": "Password reset successfully. You can now login with your new password."
}
```

---

### 2. MongoDB File Upload System

All file uploads are now stored in MongoDB instead of the file system.

#### Setup

No additional setup required - the system uses MongoDB automatically.

#### Supported File Types
- `image/jpeg`, `image/png`, `image/gif`, `image/webp`
- `application/pdf`
- Maximum file size: 10MB

#### API Endpoints

**1. Upload File**
```
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer {token}

FormData:
- file: [binary file]
- relatedTo: "event" (optional, default: "general")
- relatedId: "event_id" (optional)
```

Response:
```json
{
  "msg": "File uploaded successfully",
  "fileId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "filename": "image.png",
  "size": 51200
}
```

**2. Download File**
```
GET /api/files/download/{fileId}
```

Returns the file as a stream with appropriate MIME type and filename.

**3. Get File Info**
```
GET /api/files/info/{fileId}
```

Response:
```json
{
  "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
  "filename": "image.png",
  "mimetype": "image/png",
  "size": 51200,
  "uploadedBy": "user_id",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

**4. Delete File**
```
DELETE /api/files/{fileId}
Authorization: Bearer {token}
```

---

### 3. Updated Event Management

Events now use MongoDB file uploads for images.

#### Create Event with Image
```
POST /api/events/create
Content-Type: multipart/form-data
Authorization: Bearer {token}

FormData:
- title: "Event Title"
- description: "Event Description"
- eventDate: "2024-12-25"
- location: "Event Location"
- registrationEndDate: "2024-12-20"
- ticketPrice: 100 (optional, null for free)
- category: "Workshop" (optional)
- image: [binary file] (optional)
```

#### Get All Events
```
GET /api/events
```

Response includes populated image information (excluding buffer data for efficiency).

#### Update Event
```
PUT /api/events/{eventId}
Content-Type: multipart/form-data
Authorization: Bearer {token}

FormData: Same as create (all fields optional)
```

#### Delete Event
```
DELETE /api/events/{eventId}
Authorization: Bearer {token}
```

---

## Database Models

### ForgotPassword Model
- `user`: Reference to User
- `token`: Hashed reset token
- `expiresAt`: Auto-expires in 1 hour
- `isUsed`: Prevents token reuse
- Auto-deletes expired tokens via TTL index

### FileUpload Model
- `filename`: Original filename
- `mimetype`: MIME type of file
- `size`: File size in bytes
- `data`: Binary file data (Buffer)
- `uploadedBy`: User ID of uploader
- `relatedTo`: Category (event, profile, general)
- `relatedId`: Optional reference to related document

### Updated Event Model
- `image`: Now references FileUpload instead of storing string path

---

## Migration Notes

If you have existing events with file paths:

1. Old events will have image as a string path
2. New events will have image as ObjectId reference
3. You can gradually migrate old events or keep both systems working

---

## Error Handling

All endpoints return appropriate HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (missing fields, invalid data)
- **403**: Forbidden (unauthorized action)
- **404**: Not Found (resource doesn't exist)
- **500**: Server Error

---

## Security Features

1. **Email Verification**: Reset tokens expire after 1 hour
2. **Token Hashing**: Tokens are hashed in database
3. **Authorization**: Users can only delete their own files
4. **File Type Validation**: Only allowed MIME types accepted
5. **File Size Limit**: 10MB maximum per file

---

## Example Frontend Integration

### Forgot Password Request
```javascript
const requestPasswordReset = async (email) => {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  return response.json();
};
```

### Reset Password
```javascript
const resetPassword = async (token, newPassword, confirmPassword) => {
  const response = await fetch('/api/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmPassword })
  });
  return response.json();
};
```

### Upload File
```javascript
const uploadFile = async (file, token, relatedTo = 'general', relatedId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('relatedTo', relatedTo);
  if (relatedId) formData.append('relatedId', relatedId);

  const response = await fetch('/api/files/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

### Create Event with Image
```javascript
const createEvent = async (eventData, imageFile, token) => {
  const formData = new FormData();
  Object.keys(eventData).forEach(key => {
    formData.append(key, eventData[key]);
  });
  if (imageFile) formData.append('image', imageFile);

  const response = await fetch('/api/events/create', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData
  });
  return response.json();
};
```

---

## Troubleshooting

### Email not sending
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- For Gmail, ensure you're using App Password, not regular password
- Check email service status
- Enable "Less secure app access" if not using App Password

### File upload fails
- Check file size (max 10MB)
- Verify file MIME type is supported
- Ensure user is authenticated (valid JWT token)

### Event image not showing
- Verify fileId is correct ObjectId
- Check that file exists in database
- Use /api/files/download/{fileId} to verify file exists

---

## Running the Backend

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

The server runs on `PORT` (default: 5000) specified in `.env`.
