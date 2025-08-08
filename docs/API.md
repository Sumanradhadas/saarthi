
# SAARthi API Documentation

## Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

## Authentication
Currently, no authentication is required. All endpoints are public.

## Endpoints

### Sessions

#### Create Test Session
```http
POST /api/sessions
```

**Request Body:**
```json
{
  "userId": "string (optional)",
  "metadata": "object (optional)"
}
```

**Response:**
```json
{
  "id": "uuid",
  "userId": "string",
  "createdAt": "ISO 8601 timestamp",
  "metadata": {}
}
```

### Questions

#### Submit MCQ Answer
```http
POST /api/questions/:questionId/submit
```

**Parameters:**
- `questionId`: Question identifier

**Request Body:**
```json
{
  "sessionId": "uuid",
  "selectedOption": "string",
  "questionType": "mcq"
}
```

**Response:**
```json
{
  "id": "uuid",
  "sessionId": "uuid", 
  "questionId": "string",
  "answer": "string",
  "isCorrect": "boolean",
  "feedback": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

#### Submit Image Answer
```http
POST /api/questions/:questionId/submit
Content-Type: multipart/form-data
```

**Parameters:**
- `questionId`: Question identifier

**Form Data:**
- `sessionId`: uuid
- `questionType`: "image"
- `images`: File[] (up to 5 images, max 5MB each)

**Response:**
```json
{
  "id": "uuid",
  "sessionId": "uuid",
  "questionId": "string", 
  "extractedText": "string",
  "analysis": "string",
  "score": "number",
  "feedback": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

### File Upload

#### Upload Images
```http
POST /api/upload
Content-Type: multipart/form-data
```

**Form Data:**
- `images`: File[] (up to 5 images, max 5MB each)

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "filename": "string",
      "size": "number",
      "mimetype": "string"
    }
  ]
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "string",
  "message": "string",
  "details": "object (optional)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `413` - Payload Too Large (file size exceeded)
- `422` - Unprocessable Entity (validation failed)
- `500` - Internal Server Error

## Data Models

### Session
```typescript
interface Session {
  id: string;
  userId?: string;
  createdAt: Date;
  metadata?: Record<string, any>;
}
```

### Question Response
```typescript
interface QuestionResponse {
  id: string;
  sessionId: string;
  questionId: string;
  answer: string;
  questionType: 'mcq' | 'image';
  isCorrect?: boolean;
  feedback?: string;
  extractedText?: string;
  analysis?: string;
  score?: number;
  createdAt: Date;
}
```

## Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

## File Upload Constraints

- Maximum file size: 5MB per image
- Maximum files per request: 5
- Supported formats: JPEG, PNG, GIF, WebP
- Files are processed in memory and not stored permanently

## AI Processing

### MCQ Questions
- Uses Google Gemini AI for feedback generation
- Provides personalized, mentor-like responses
- Analyzes answer correctness and provides explanations

### Image Questions  
- Primary: OCR.space API for text extraction
- Fallback: Google Gemini Vision for text extraction
- Analysis: Google Gemini AI for content evaluation
- Scoring based on marking schemes and educational criteria

## Example Requests

### Create Session
```bash
curl -X POST http://localhost:5000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"userId": "student123"}'
```

### Submit MCQ Answer
```bash
curl -X POST http://localhost:5000/api/questions/q1/submit \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "uuid-here",
    "selectedOption": "A",
    "questionType": "mcq"
  }'
```

### Upload Images
```bash
curl -X POST http://localhost:5000/api/questions/q2/submit \
  -F "sessionId=uuid-here" \
  -F "questionType=image" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```
