# Migration Guide: Amazon SES to Postmark Transactional

This guide outlines the steps to migrate from Amazon SES to Postmark Transactional for email sending in the backend.

## Overview

Postmark Transactional is a reliable email delivery service that provides better deliverability, detailed analytics, and simpler API compared to Amazon SES.

## Prerequisites

1. Create a Postmark account at https://postmarkapp.com
2. Create a Server API Token in your Postmark account
3. Verify your sending domain in Postmark
4. Install the Postmark SDK (if using Node.js) or use their REST API

## Backend Changes Required

### 1. Update Dependencies

**Remove AWS SES SDK:**
```bash
npm uninstall @aws-sdk/client-ses
# or
pip uninstall boto3  # if using Python
```

**Add Postmark SDK:**
```bash
npm install postmark
# or
pip install postmarker  # if using Python
```

### 2. Environment Variables

**Remove:**
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_SES_FROM_EMAIL`

**Add:**
- `POSTMARK_API_TOKEN` - Your Postmark Server API Token
- `POSTMARK_FROM_EMAIL` - Verified sender email address (e.g., `noreply@evendating.us`)

### 3. Email Service Implementation

#### Node.js/TypeScript Example

**Before (SES):**
```typescript
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
  textBody?: string
) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL!,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: htmlBody },
        Text: { Data: textBody || htmlBody },
      },
    },
  });

  return await sesClient.send(command);
}
```

**After (Postmark):**
```typescript
import * as postmark from 'postmark';

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN!);

export async function sendEmail(
  to: string,
  subject: string,
  htmlBody: string,
  textBody?: string
) {
  return await client.sendEmail({
    From: process.env.POSTMARK_FROM_EMAIL!,
    To: to,
    Subject: subject,
    HtmlBody: htmlBody,
    TextBody: textBody || htmlBody,
    MessageStream: 'outbound', // or 'broadcasts' for marketing emails
  });
}
```

#### Python Example

**Before (SES):**
```python
import boto3
from botocore.exceptions import ClientError

ses_client = boto3.client(
    'ses',
    region_name=os.environ['AWS_REGION'],
    aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
    aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
)

def send_email(to, subject, html_body, text_body=None):
    try:
        response = ses_client.send_email(
            Source=os.environ['AWS_SES_FROM_EMAIL'],
            Destination={'ToAddresses': [to]},
            Message={
                'Subject': {'Data': subject},
                'Body': {
                    'Html': {'Data': html_body},
                    'Text': {'Data': text_body or html_body}
                }
            }
        )
        return response
    except ClientError as e:
        raise Exception(f"Failed to send email: {e}")
```

**After (Postmark):**
```python
from postmarker.core import PostmarkClient

postmark_client = PostmarkClient(server_token=os.environ['POSTMARK_API_TOKEN'])

def send_email(to, subject, html_body, text_body=None):
    try:
        response = postmark_client.emails.send(
            From=os.environ['POSTMARK_FROM_EMAIL'],
            To=to,
            Subject=subject,
            HtmlBody=html_body,
            TextBody=text_body or html_body,
            MessageStream='outbound'
        )
        return response
    except Exception as e:
        raise Exception(f"Failed to send email: {e}")
```

### 4. Error Handling

Postmark provides more detailed error responses. Update error handling:

```typescript
try {
  await sendEmail(to, subject, htmlBody, textBody);
} catch (error) {
  if (error instanceof postmark.Models.PostmarkError) {
    // Handle Postmark-specific errors
    console.error('Postmark error:', error.message);
    // Error codes: 401 (invalid token), 422 (validation error), etc.
  }
  throw error;
}
```

### 5. Email Templates (Optional)

Postmark supports email templates. If you're using templates:

```typescript
// Send with template
await client.sendEmailWithTemplate({
  From: process.env.POSTMARK_FROM_EMAIL!,
  To: to,
  TemplateId: 12345678, // Your template ID
  TemplateModel: {
    name: userName,
    action_url: resetUrl,
    // ... other template variables
  },
  MessageStream: 'outbound',
});
```

### 6. Common Email Use Cases

#### Support Ticket Notifications
```typescript
await sendEmail(
  adminEmail,
  `New Support Ticket: ${ticket.subject}`,
  `<h1>New Support Ticket</h1>
   <p><strong>From:</strong> ${ticket.name} (${ticket.email})</p>
   <p><strong>Category:</strong> ${ticket.category}</p>
   <p><strong>Priority:</strong> ${ticket.priority}</p>
   <p><strong>Message:</strong></p>
   <p>${ticket.description}</p>`
);
```

#### Suggestion Submissions
```typescript
await sendEmail(
  adminEmail,
  `New Suggestion: ${suggestion.subject}`,
  `<h1>New Suggestion</h1>
   <p><strong>From:</strong> ${suggestion.name} (${suggestion.email})</p>
   <p><strong>Category:</strong> ${suggestion.category}</p>
   <p><strong>Suggestion:</strong></p>
   <p>${suggestion.suggestion}</p>`
);
```

## API Endpoints That May Need Updates

Based on the frontend code, these endpoints likely send emails:

1. `/support/ticket` - Support ticket submissions
2. `/suggestions` - Suggestion submissions
3. Admin-related email notifications (if any)

Update the email sending logic in these endpoints to use Postmark instead of SES.

## Testing

1. **Test in Development:**
   - Use Postmark's test server token
   - Send test emails to verify functionality

2. **Verify Deliverability:**
   - Check Postmark dashboard for delivery status
   - Monitor bounce and spam complaint rates

3. **Update Error Logging:**
   - Postmark provides detailed delivery information
   - Update logging to capture Postmark-specific metrics

## Benefits of Postmark

- **Better Deliverability:** Higher inbox placement rates
- **Detailed Analytics:** Track opens, clicks, bounces, and spam complaints
- **Simpler API:** Easier to use than AWS SES
- **Better Error Messages:** More descriptive error responses
- **Template Support:** Built-in email template system
- **Webhooks:** Real-time delivery and bounce notifications

## Rollback Plan

If you need to rollback:
1. Keep AWS SES credentials in environment variables (commented out)
2. Maintain the old SES code in a separate branch
3. Test thoroughly before removing SES configuration

## Additional Resources

- [Postmark API Documentation](https://postmarkapp.com/developer/api/email-api)
- [Postmark Node.js SDK](https://github.com/wildbit/postmark.js)
- [Postmark Python SDK](https://github.com/Stranger6667/postmarker)
- [Postmark Best Practices](https://postmarkapp.com/guides)

