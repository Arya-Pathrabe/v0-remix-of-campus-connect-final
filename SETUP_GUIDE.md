# Campus Connect - Setup Guide

## Project Overview
Campus Connect is a comprehensive study platform with the following features:
- AI Study Assistant powered by OpenAI
- Notes Marketplace with file uploads
- Community Hub with approval system
- Study Room with white/brown noise
- Shopping Cart & Payment Integration
- User Profiles & Statistics

## Database Setup

### 1. Run Database Migration
The database schema is already defined in `scripts/01-create-tables.sql`. Execute this script in your Supabase SQL editor to create all tables with RLS policies.

### 2. Environment Variables
Ensure these environment variables are set in your Vercel project:
\`\`\`
SUPABASE_NEXT_PUBLIC_SUPABASE_URL=your_supaSUPABASE_NEXT_PUBLIC_SUPABASE_ANON_KEY_ANON_KEY=your_supabase_anon_key
SUPABASE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## API Routes

### Notes Management
- `POST /api/notes/upload` - Upload new notes
- `POST /api/notes/download` - Download notes and track downloads

### Shopping Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `GET /api/cart/get` - Fetch cart items

### Payments
- `POST /api/payment/process` - Process payment and create order
  - Supports: UPI, WhatsApp Pay, Telegram Pay
  - All payments directed to: pathrabearya@okicici

### AI Assistant
- `POST /api/ai/chat` - Chat with AI assistant
  - Uses OpenAI GPT-4 mini
  - Provides context from user's notes

### Community
- `POST /api/community/create` - Create new community
- `POST /api/community/join` - Request to join community
- `POST /api/community/approve` - Admin approves join request
- `POST /api/community/message` - Send message with file support

### Subscriptions
- `GET /api/subscription/check` - Check premium status
- `POST /api/subscription/create` - Create premium subscription
  - Plans: ₹299/month, ₹599/6 months, ₹999/year

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/notes` - Get user's uploaded notes
- `GET /api/user/downloads` - Get user's downloaded notes

## Features

### 1. AI Study Assistant
- Real-time chat interface
- Context-aware responses using user's notes
- Supports explaining concepts, solving problems, generating quizzes

### 2. Notes Marketplace
- Upload notes with drag-and-drop
- Search and filter by category
- Real-time pricing and download tracking
- Add to cart functionality

### 3. Community Hub
- Create public or anonymous communities
- Join requests with admin approval
- Real-time chat with file/image/video sharing
- Member management

### 4. Study Room
- White and brown noise generation using Web Audio API
- 60-day free trial
- Premium subscription plans
- Volume control and play/pause

### 5. Shopping Cart & Checkout
- Multiple payment methods:
  - UPI (Google Pay, PhonePe)
  - WhatsApp Pay
  - Telegram Pay
- Order tracking and download management

### 6. User Profile
- Edit profile information
- View earnings and statistics
- Manage uploaded notes
- Download history

## Payment Integration

### UPI Payment
- Users enter their UPI ID
- Payment link generated for pathrabearya@okicici
- Automatic order creation on payment

### WhatsApp & Telegram
- Users share payment details via WhatsApp/Telegram
- Manual verification required
- Order created after confirmation

## Design System

### Color Palette (Royal Dark Theme)
- Primary: #8b5cf6 (Purple)
- Secondary: #6d28d9 (Deep Purple)
- Accent: #a78bfa (Light Purple)
- Background: #0a0e27 (Dark Blue)
- Card: #1a1f3a (Dark Card)

### Typography
- Font: Geist (sans-serif)
- Mono: Geist Mono

### Animations
- Float animation for background elements
- Glow effect on hover
- Slide-in animations for modals

## Deployment

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

## Testing

### Test Accounts
Create test users in Supabase Auth for testing different features:
- Admin user (for community management)
- Regular user (for marketplace)
- Premium user (for study room)

### Test Payments
Use test UPI IDs and phone numbers for payment testing.

## Troubleshooting

### Database Connection Issues
- Verify Supabase URL and keys are correct
- Check RLS policies are enabled
- Ensure tables are created from migration script

### File Upload Issues
- Verify Vercel Blob is configured
- Check file size limits
- Ensure CORS is properly configured

### Payment Issues
- Verify payment ID format
- Check transaction ID generation
- Ensure payment method is supported

## Future Enhancements
- OAuth authentication
- Real-time notifications
- Advanced search with filters
- Recommendation engine
- Mobile app
- Video tutorials
- Live study sessions
