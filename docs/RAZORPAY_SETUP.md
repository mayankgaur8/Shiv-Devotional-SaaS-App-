# Razorpay Setup (Temple Donations)

## 1. Install dependencies

```bash
npm install razorpay
```

## 2. Environment variables

Create `.env.local` with:

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_xxxxxxxx
TEMPLE_DONATION_DB_FILE=src/data/temple-donations.json
```

Notes:
- `RAZORPAY_KEY_SECRET` stays server-side only.
- `NEXT_PUBLIC_RAZORPAY_KEY` is safe to expose and used by Razorpay Checkout.

## 3. API endpoints

- `POST /api/payment/create-order`
- `POST /api/payment/verify`
- `POST /api/payment/update-status`
- `GET /api/payment/history`

## 4. DB schema

Use [db/donations.schema.sql](db/donations.schema.sql) in production SQL DB.

Current local persistence uses JSON file (configured by `TEMPLE_DONATION_DB_FILE`) for quick development.
On serverless deployments, file writes are ephemeral/non-persistent, so move to SQL DB persistence for reliable donation history.

## 5. Test mode

Use Razorpay test card:

- `4111 1111 1111 1111`
- Any future expiry
- Any CVV
- Any OTP in test environment

## 6. Verify flows

1. Success: create order -> checkout -> verify signature -> status `success`
2. Failure: payment failure callback -> status `failed`
3. Popup closed: checkout dismissed -> status `abandoned`
4. Duplicate clicks: server returns existing recent active order

## 7. Run

```bash
npm run lint
npm run build
npm run dev
```
