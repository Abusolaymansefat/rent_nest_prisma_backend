# RentNest Prisma Backend

A comprehensive rental property management system built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Live Demo

🚀 **Live API**: [https://rentnestprismabackend.vercel.app/]

## Features

- **User Management**: Register, login, and profile management with role-based access control (Admin, Landlord, Tenant)
- **Property Management**: Landlords can create, update, and delete rental properties with categories
- **Rental Requests**: Tenants can request to rent properties, landlords can approve/reject requests
- **Payment Integration**: Stripe checkout integration for processing rental payments
- **Review System**: Tenants can review properties they've rented
- **Admin Dashboard**: Admin panel for managing users, properties, and rental requests
- **Authentication**: JWT-based authentication with access and refresh tokens

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Payment**: Stripe
- **Validation**: Custom validation with TypeScript interfaces

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Stripe account (for payment integration)

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd rent_nest_prisma_backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/rentnest
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
BCRYPT_SALT_ROUNDS=10
APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRODUCT_PRICE_ID=your_stripe_price_id
```

4. **Database Setup**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Or deploy migrations
npx prisma migrate deploy
```

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build the project
npm run build

# Start production server
npm start

# Stripe webhook listener
npm run stripe:webhook
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token

### Properties

- `GET /api/properties` - Get all properties (with pagination and filters)
- `GET /api/properties/:id` - Get single property details
- `POST /api/landlord/properties` - Create property (Landlord only)
- `PATCH /api/landlord/properties/:id` - Update property (Landlord only)
- `DELETE /api/landlord/properties/:id` - Delete property (Landlord only)

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin/Landlord/Tenant)

### Rental Requests

- `POST /api/rentals/create` - Create rental request (Tenant only)
- `GET /api/rentals/my-requests` - Get my rental requests (Tenant only)
- `GET /api/landlord/rental-requests` - Get rental requests for my properties (Landlord only)
- `PATCH /api/landlord/rental-requests/:id` - Update rental request status (Landlord only)

### Payments

- `POST /api/payments/create` - Create payment session (Tenant only)
- `POST /api/payments/confirm` - Confirm payment (Tenant only)
- `GET /api/payments` - Get my payments (Tenant only)
- `GET /api/payments/:id` - Get single payment details (Tenant only)
- `POST /api/payments/webhook` - Stripe webhook endpoint

### Reviews

- `POST /api/reviews` - Create review (Tenant only)
- `GET /api/reviews/property/:propertyId` - Get reviews for a property

### Admin

- `GET /api/admin/users` - Get all users (Admin only)
- `PATCH /api/admin/users/:id` - Update user status/profile (Admin only)
- `GET /api/admin/properties` - Get all properties (Admin only)
- `GET /api/admin/rentals` - Get all rental requests (Admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics (Admin only)

## User Roles

- **ADMIN**: Full access to all resources, can manage users and view all data
- **LANDLORD**: Can manage properties and approve/reject rental requests
- **TENANT**: Can browse properties, create rental requests, and make payments

## Database Schema

The application uses Prisma with the following main models:

- **User**: User accounts with roles and status
- **Property**: Rental properties with categories
- **Category**: Property categories
- **RentalRequest**: Rental requests from tenants to landlords
- **Payment**: Payment records linked to rental requests
- **Review**: Property reviews from tenants

## Payment Flow

1. Tenant creates a rental request for a property
2. Landlord approves the rental request
3. Tenant calls `/api/payments/create` with the rental request ID
4. Backend creates a Stripe checkout session and returns the payment URL
5. Tenant is redirected to Stripe to complete payment
6. Stripe webhook updates payment status and activates the rental

## Error Handling

The API uses a global error handler that returns consistent error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message"
}
```

## Development

### Adding New Features

1. Create the model in Prisma schema
2. Run migration: `npx prisma migrate dev`
3. Generate Prisma client: `npx prisma generate`
4. Create service, controller, and router files
5. Add routes to `app.ts`
6. Update types and interfaces

### Code Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── config/                # Configuration files
├── lib/                   # Utility libraries (Prisma, Stripe)
├── middleware/            # Express middleware (auth, error handling)
├── modules/               # Feature modules
│   ├── auth/
│   ├── admin/
│   ├── category/
│   ├── landlord/
│   ├── payment/
│   ├── property/
│   ├── rental/
│   └── review/
└── utils/                 # Utility functions
```

## Deployment

### Vercel Deployment

1. Set environment variables in Vercel dashboard
2. Deploy using Vercel CLI or GitHub integration
3. The `vercel.json` file is configured for deployment

### Environment Variables for Production

- `DATABASE_URL` - Production PostgreSQL connection string
- `JWT_ACCESS_SECRET` - Strong secret for JWT tokens
- `JWT_REFRESH_SECRET` - Strong secret for refresh tokens
- `STRIPE_SECRET_KEY` - Production Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Production Stripe webhook secret
- `APP_URL` - Production frontend URL

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Verify database credentials

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Run `npx prisma migrate dev` to apply migrations
- Check Prisma schema for syntax errors

### Stripe Issues
- Verify Stripe keys are correct
- Ensure webhook endpoint is publicly accessible
- Check Stripe dashboard for webhook events

## License

ISC

## Support

For issues and questions, please contact the development team.
