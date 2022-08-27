import OAuth from "oauth";
import { OAuth2Client } from "google-auth-library";
import { Router } from "express";
import {
  getOAuthAccessTokenWith,
  getOAuthRequestToken,
} from "../utils/oAuthHelpers";
import { handleSocialSignInData } from "../utils/handleSocialSignInData";
import jwt from "jsonwebtoken";
import { parseCookiesToObject } from "@onesocial/shared";
import * as yup from "yup";
import { setAuthTokenAsCookie } from "../utils/setSignedTokenAsCookie";
import Express from "express";
import { PotentialUserModel } from "@onesocial/shared";
import {
  potentialUserModelRepository,
  userModelRepository,
} from "../db/respositories";
const router = Router();

router.use(Express.json());

let twitterOauthClientInstance = new OAuth.OAuth(
  "https://api.twitter.com/oauth/request_token",
  "https://api.twitter.com/oauth/access_token",
  process.env.TWITTER_CONSUMER_API_KEY ?? "",
  process.env.TWITTER_CONSUMER_API_SECRET ?? "",
  "1.0A",
  null,
  "HMAC-SHA1"
);

const googleOAuth2ClientInstance = new OAuth2Client({
  clientId: process.env.GIS_CLIENT_ID,
  clientSecret: process.env.GIS_CLIENT_SECRET,
  redirectUri: `${process.env.AUTH_CLIENT_REDIRECT_BASE_URL}/api/auth/google/callback`,
});

/**
 * Route to start the oauth process of twitter
 */
router.get("/twitter/start", async (req, res) => {
  try {
    const { oauthRequestToken, oauthRequestTokenSecret } =
      await getOAuthRequestToken(twitterOauthClientInstance);
    const method = "authenticate";
    const authUrl = `https://api.twitter.com/oauth/${method}?oauth_token=${oauthRequestToken}`;
    res.cookie("twitter_tmp_oauth_token_secret", oauthRequestTokenSecret);

    res.redirect(authUrl);
  } catch (err) {
    // TODO:
    // sendErrorResponse(res, err);
  }
});

/**
 * Twitter Oauth Callback
 */
router.get("/twitter/callback", async (req, res) => {
  try {
    const {
      oauth_token,
      oauth_verifier,
    }: {
      oauth_token: string;
      oauth_verifier: string;
    } = req.query as any;

    const oauthRequestTokenSecret =
      req.cookies["twitter_tmp_oauth_token_secret"];

    const { oauthAccessToken, oauthAccessTokenSecret, results } =
      await getOAuthAccessTokenWith(
        twitterOauthClientInstance,
        oauth_token,
        oauthRequestTokenSecret,
        oauth_verifier
      );
    const user_id: string = results.user_id;

    twitterOauthClientInstance.get(
      "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
      oauthAccessToken,
      oauthAccessTokenSecret,
      (err, results: any) => {
        if (err) throw err;
        const userObject = JSON.parse(results);
        const picture: string = userObject.profile_image_url_https;
        const email = userObject.email;
        // perform magic
        handleSocialSignInData(res, {
          name: userObject.name,
          email,
          avatar_url: picture,
          using_twitter_auth: true,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

/**
 * Google OAuth start
 */
router.get("/google/start", async (req, res) => {
  try {
    const authUrl = googleOAuth2ClientInstance.generateAuthUrl({
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ],
    });
    res.redirect(authUrl);
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});
/**
 * Google OAuth Callback
 */
router.get("/google/callback", async (req, res) => {
  try {
    const code: string = (req.query as any).code;
    let { tokens } = await googleOAuth2ClientInstance.getToken(code);
    googleOAuth2ClientInstance.setCredentials(tokens);

    // get data
    // also we're damn sure that the token integrity is okay
    const data: any = jwt.decode(tokens.id_token as string);

    const { name, email, picture } = data;

    // TODO: save the picture to our storage

    handleSocialSignInData(res, {
      name,
      email,
      avatar_url: picture,
      using_google_auth: true,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/error");
  }
});

router.get("/persevere", async (req, res) => {
  try {
    const cookieObj = parseCookiesToObject(req.headers.cookie ?? "");
    const token = cookieObj["oneSocialKeeperTmp"];
    const obj: PotentialUserModel = jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_SECRET ?? ""
    ) as any;

    // check if the obj is valid
    const instance = await potentialUserModelRepository
      .search()
      .where("email")
      .eq(obj.email)
      .return.first();
    if (!instance) {
      throw new Error("Registration is already complete!");
    } else {
      res.send({
        error: false,
        data: instance,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: true,
      message: err.message,
    });
  }
});

router.post("/register/complete", async (req, res) => {
  try {
    const body = req.body;

    const shape = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().required(),
      id: yup.string().required(),
      tagline: yup.string().required(),
    });

    // look for the cookie
    const cookieObj = parseCookiesToObject(req.headers.cookie ?? "");
    const token = cookieObj["oneSocialKeeperTmp"];
    // and the new data posted

    const validatedData = shape.validateSync(body);

    const obj: PotentialUserModel = jwt.verify(
      token,
      process.env.JSON_WEB_TOKEN_SECRET ?? ""
    ) as any;
    const instance = await potentialUserModelRepository
      .search()
      .where("email")
      .eq(obj.email)
      .return.first();

    if (!instance) {
      throw new Error("Registration is already complete!");
    }

    const sameIdInstance = await userModelRepository
      .search()
      .where("id")
      .equal(validatedData.id)
      .return.firstId();
    if (sameIdInstance) throw new Error("Username already taken");

    // create the account
    potentialUserModelRepository.remove(instance.entityId);

    const newUser = userModelRepository.createEntity();

    newUser.avatar_url = instance.avatar_url;
    newUser.name = validatedData.name;
    newUser.id = validatedData.id;
    newUser.is_google_account_connected = obj.is_google_account_connected;
    newUser.twitter_user_name = obj.twitter_user_name;
    newUser.registered_at = new Date();
    newUser.last_token_generated_at = newUser.registered_at;
    newUser.email = obj.email;
    newUser.tagline = validatedData.tagline;

    userModelRepository.save(newUser);

    // remove cookie
    res.cookie("oneSocialKeeperTmp", null, {
      maxAge: -1,
    });

    setAuthTokenAsCookie(res, newUser);

    res.send({
      error: false,
      data: "Successfully registered! 🎉",
    });
  } catch (err) {
    res.send({
      error: true,
      message: err.message,
    });
  }

  // check if there is an instance in tmp_user table

  // if not throw an error

  // if yes, then send the cookie;
});

/**
 * Route to logout the user
 */
router.get("/logOut/", (req, res) => {
  res.cookie("oneSocialKeeper", null, {
    maxAge: -1,
  });
  res.cookie("oneSocialKeeperTmp", null, {
    maxAge: -1,
  });
  res.send({
    error: false,
    user: "Logged out successfully!",
  });
});

export default router;
