import { Router, raw } from "express";
import stripe from "stripe";
import { jwtUserPayloadType } from "@onesocial/shared";
import { parseCookiesToObject } from "../utils/parseCookies";
import jwt from "jsonwebtoken";
import {
  listingModelRepository,
  PriceCurrency,
  listingBuyModelRepository,
} from "@onesocial/shared";

const stripeApiKey = process.env.STRIPE_API_KEY as string;

const stripeHandler = new stripe(stripeApiKey, {
  apiVersion: "2022-08-01",
});

const app = Router();

const frontendUrl = process.env.AUTH_CLIENT_REDIRECT_BASE_URL as string;

app.get("/checkout/:listingId", async (req, res) => {
  try {
    const listingId = req.params.listingId as string;
    if (!listingId) throw new Error("No listing id");
    const listingDetailedPage = `${frontendUrl}/listings/${listingId}`;

    const cookieObj = parseCookiesToObject(req.headers.cookie ?? "");
    const token = cookieObj["oneSocialKeeper"];

    const user: jwtUserPayloadType = jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_SECRET ?? ""
    ) as any;

    // fetch listing details
    const listing = await listingModelRepository.fetch(listingId);
    if (!listing) throw new Error("No listing found");

    // TODO: check if already bought then cancel it

    if (listing.price === 0) {
      await createBuyInstance({
        userId: user.id,
        listingId,
        amount_total: listing.price,
        currency: listing.currency,
        owner_id: listing.author_id,
      });
      res.redirect(listingDetailedPage);
      return;
    }

    const session = await stripeHandler.checkout.sessions.create({
      currency: listing.currency,
      line_items: [
        {
          quantity: 1,
          price_data: {
            unit_amount: listing.price * 100, // for some reasons stripe expects price in cents
            currency: listing.currency,
            product_data: {
              name: listing.name,
              description: listing.desc_full_markdown.toString(),
              images: [listing.cover_image_url],
            },
          },
        },
      ],
      mode: "payment",
      success_url: listingDetailedPage,
      cancel_url: listingDetailedPage,
      client_reference_id: `${user?.id}---${listingId}---${listing.author_id}`,
    });

    res.redirect(session.url ?? "/error");
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }
});

const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET as string;

app.post("/webhook", raw({ type: "application/json" }), async (req, res) => {
  const payload = req.body;
  const sig: any = req.headers["stripe-signature"];

  try {
    let event = stripeHandler.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret
    );

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session: any = event.data.object;
      // Fulfill the purchase...
      const [userId, listingId, author_id] =
        session.client_reference_id.split("---");
      console.log(userId, listingId);

      const { currency, amount_total } = session;

      await createBuyInstance({
        userId,
        listingId,
        amount_total: amount_total / 100,
        currency: currency == "inr" ? PriceCurrency.Inr : PriceCurrency.Usd,
        owner_id: author_id,
      });

      res.send({
        error: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

export default app;

const createBuyInstance = async ({
  userId,
  listingId,
  amount_total,
  currency,
  owner_id,
}: {
  userId: string;
  listingId: string;
  amount_total: number;
  currency: PriceCurrency;
  owner_id: string;
}) => {
  const instance = listingBuyModelRepository.createEntity();
  instance.bought_at = new Date().toISOString();
  instance.buyer_id = userId;
  instance.listing_id = listingId;
  instance.price = amount_total;
  instance.currency = currency;
  instance.owner_id = owner_id;
  await listingBuyModelRepository.save(instance);
};
