# Stripe refund setup

The application creates refunds with the server-side `STRIPE_SECRET_KEY` and
confirms their final state through `/api/stripe/webhook`.

## Production webhook

Create a Stripe webhook destination with this endpoint:

```text
https://YOUR_DOMAIN/api/stripe/webhook
```

Subscribe to these events:

```text
checkout.session.completed
checkout.session.expired
checkout.session.async_payment_failed
refund.created
refund.updated
refund.failed
charge.refund.updated
charge.refunded
```

Copy the destination signing secret (`whsec_...`) to
`STRIPE_WEBHOOK_SECRET`. Use keys and webhook secrets from the same Stripe
mode: test keys with a test webhook, live keys with a live webhook.

`STRIPE_SECRET_KEY` must be a server-side secret key. If a restricted key is
used, grant it write access to Refunds and the existing access required for
Checkout Sessions and PaymentIntents.

Stripe refund emails are optional. Enable successful refund emails in the
Stripe customer email settings when Stripe should notify the applicant.

## Local webhook

With the Stripe CLI authenticated, forward events to the local application:

```bash
stripe listen \
  --events checkout.session.completed,checkout.session.expired,checkout.session.async_payment_failed,refund.created,refund.updated,refund.failed,charge.refund.updated,charge.refunded \
  --forward-to localhost:3000/api/stripe/webhook
```

Set the `whsec_...` value printed by the CLI as the local
`STRIPE_WEBHOOK_SECRET`.

## Database

Apply `supabase/migrations/005_partial_refunds.sql` before deploying the
application code. The migration adds refund requests, partial-refund order and
payment states, cumulative refunded amounts, and commission adjustments.
