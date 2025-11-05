# HUMMBL API Endpoints

This directory contains Vercel serverless function endpoints for user engagement features.

## Overview

The API provides three main endpoints for user interaction:
- **Contact Form**: `/api/contact` - Full contact form submissions
- **Newsletter**: `/api/newsletter` - Email newsletter subscriptions  
- **Feedback**: `/api/feedback` - Quick feedback submissions

All endpoints use [Resend](https://resend.com) for email delivery.

## Setup

### 1. Install Dependencies

```bash
npm install resend @vercel/node
```

### 2. Configure Environment Variables

Create `.env.local` file (copy from `.env.example`):

```bash
RESEND_API_KEY=re_your_api_key_here
```

### 3. Verify Email Domains in Resend

Before deployment, verify your sending domains in Resend:
1. Go to [Resend Dashboard](https://resend.com/domains)
2. Add and verify `hummbl.io` domain
3. Update `from` addresses in API files if needed

## API Endpoints

### POST /api/contact

Handles contact form submissions.

**Request Body:**
```typescript
{
  name: string;      // Required, non-empty
  email: string;     // Required, valid email format
  message: string;   // Required, minimum 10 characters
}
```

**Response (Success 200):**
```typescript
{
  success: true,
  message: "Thank you for your message! We'll get back to you soon."
}
```

**Response (Error 400/500):**
```typescript
{
  success: false,
  error: string,
  message: string
}
```

### POST /api/newsletter

Handles newsletter subscription requests.

**Request Body:**
```typescript
{
  email: string;  // Required, valid email format
}
```

**Response (Success 200):**
```typescript
{
  success: true,
  message: "Successfully subscribed! Check your email for confirmation."
}
```

**Response (Error 400/500):**
```typescript
{
  success: false,
  error: string,
  message: string
}
```

### POST /api/feedback

Handles quick feedback submissions.

**Request Body:**
```typescript
{
  feedback: string;   // Required, non-empty
  email?: string;     // Optional, valid email if provided
}
```

**Response (Success 200):**
```typescript
{
  success: true,
  message: "Thank you for your feedback!"
}
```

**Response (Error 400/500):**
```typescript
{
  success: false,
  error: string,
  message: string
}
```

## Validation

All endpoints include:
- ✅ Request method validation (POST only)
- ✅ Request body validation (type checking, format validation)
- ✅ Email format validation (regex)
- ✅ Input sanitization
- ✅ Error handling with appropriate HTTP status codes

## Email Templates

### Contact Email
- **From**: `HUMMBL Contact <contact@hummbl.io>`
- **To**: `contact@hummbl.io`
- **Reply-To**: User's email
- **Subject**: `Contact Form: Message from {name}`
- **Body**: HTML + plain text with user details and message

### Newsletter Welcome Email
- **From**: `HUMMBL Newsletter <newsletter@hummbl.io>`
- **To**: Subscriber's email
- **Subject**: `Welcome to HUMMBL Updates`
- **Body**: HTML + plain text welcome message
- **Also sends**: Team notification to `contact@hummbl.io`

### Feedback Email
- **From**: `HUMMBL Feedback <feedback@hummbl.io>`
- **To**: `feedback@hummbl.io`
- **Reply-To**: User's email (if provided)
- **Subject**: `User Feedback from HUMMBL Website`
- **Body**: HTML + plain text with feedback and optional email

## Error Handling

All endpoints implement comprehensive error handling:

1. **Method Validation**: Returns 405 for non-POST requests
2. **Request Validation**: Returns 400 for invalid/missing data
3. **Email Service Errors**: Returns 500 with user-friendly message
4. **Server Errors**: Returns 500 with generic error message
5. **Logging**: All errors logged to console for debugging

## Security Considerations

### Implemented
✅ TypeScript strict mode with proper type validation  
✅ Input validation and sanitization  
✅ Method restriction (POST only)  
✅ CORS handling (automatic with Vercel)  
✅ Environment variable protection  

### Recommended for Production
⚠️ Rate limiting (prevent spam/abuse)  
⚠️ CAPTCHA integration (reCAPTCHA, hCaptcha)  
⚠️ Honeypot fields (bot detection)  
⚠️ IP-based throttling  
⚠️ Email verification for newsletter  
⚠️ Unsubscribe links for newsletter  

## Local Development

### Test with Development Server

```bash
# Start Vite dev server
npm run dev

# API endpoints available at:
# http://localhost:5173/api/contact
# http://localhost:5173/api/newsletter
# http://localhost:5173/api/feedback
```

### Test with cURL

```bash
# Test contact endpoint
curl -X POST http://localhost:5173/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"This is a test message from the API."}'

# Test newsletter endpoint
curl -X POST http://localhost:5173/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Test feedback endpoint
curl -X POST http://localhost:5173/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"feedback":"Great framework!","email":"test@example.com"}'
```

## Deployment

### Vercel Deployment

API routes are automatically deployed as serverless functions when you deploy to Vercel:

```bash
# Deploy to production
vercel --prod

# Or push to staging branch (auto-deploys)
git push origin staging
```

### Environment Variables on Vercel

Set environment variables in Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add `RESEND_API_KEY` with your Resend API key
3. Set for Production, Preview, and Development environments

## Monitoring

### Logs

View logs in Vercel Dashboard:
- Go to Project → Deployments → Click deployment → Functions
- Each API call logs:
  - Success: Email ID and recipient
  - Error: Full error details

### Resend Dashboard

Monitor email delivery in [Resend Dashboard](https://resend.com/emails):
- Delivery status
- Open rates (if tracking enabled)
- Bounce/complaint rates
- API usage statistics

## Future Enhancements

### Planned
- [ ] Newsletter service integration (Mailchimp/ConvertKit)
- [ ] Email verification for newsletter
- [ ] Unsubscribe functionality
- [ ] Rate limiting middleware
- [ ] CAPTCHA integration
- [ ] Analytics integration
- [ ] Email templates with React Email

### Optional
- [ ] Attachment support for contact form
- [ ] File upload for feedback
- [ ] Multi-language support
- [ ] Auto-responder customization
- [ ] CRM integration (HubSpot, Salesforce)

## Troubleshooting

### "Email service error"
- Check Resend API key is correct in environment variables
- Verify sending domain in Resend dashboard
- Check Resend dashboard for delivery errors
- Ensure sender email matches verified domain

### "Method not allowed"
- Ensure request uses POST method
- Check CORS settings if calling from different origin

### "Invalid request"
- Verify request body matches expected schema
- Check email format is valid
- Ensure all required fields are included
- Verify Content-Type header is `application/json`

### Emails not sending
- Check Resend API quota/limits
- Verify environment variables are set in Vercel
- Check Resend dashboard for bounces/complaints
- Ensure domain is verified in Resend

## Support

For issues related to:
- **Resend**: https://resend.com/docs
- **Vercel**: https://vercel.com/docs/functions/serverless-functions
- **HUMMBL**: contact@hummbl.io

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-04  
**Tech Stack**: Vercel Serverless Functions + Hono.js + Resend
