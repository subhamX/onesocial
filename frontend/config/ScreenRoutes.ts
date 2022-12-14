import { ListingType } from "../graphql/generated_graphql_types";

// export const NEW_USER_WELCOME_URL = "/auth/welcome";


export const DASHBOARD_URL = "/dash";

export const BLOG_URL = "https://dev.to/subhamx/onesocial-the-ultimate-social-app-51d0";
export const GITHUB_URL = "https://github.com/subhamX/onesocial";

export const LANDING_PAGE = "/";

export const LOGOUT_URL = "/ms/impact/api/auth/logout";

export const MY_PROFILE_PROXY = "/profile/me";
export const DISCOVER = "/discover";
export const MY_FOLLOWERS = "/followers";
export const MY_FOLLOWINGS = "/followings";

export const USER_WALL_SCREEN = (wallId: string) => `/u/${wallId}`;

export const FEATURES_URL_HASH = "/#features";

export const DETAILED_POST = (post_id: string) => `/posts/${post_id}`;
export const CREATE_NEW_POST = `/posts/new`;
export const CREATE_NEW_EVENT = `/events/new`;

export const MANAGE_EVENT = (eventId: string) => `/events/${eventId}/manage`;
export const EDIT_EVENT = (eventId: string) => `/events/${eventId}/edit`;
export const EDIT_POST = (postId: string) => `/posts/${postId}/edit`;

export const CREATE_NEW_LISTING = `/listings/new`;
export const MANAGE_PRODUCT_LISTING_CONTENT = (id: string) =>
  `/listings/manage/products/${id}`;
export const EDIT_LISTING = (listingId: string) =>
  `/listings/edit/${listingId}`;

export const DETAILED_EVENT = (eventId: string) => `/events/${eventId}`;

export const DETAILED_LISTING = (type: any, id: string) =>
  `/listings/${id}`;

export const ALL_CUSTOMERS = `/customers`;

export const GOOGLE_AUTH_START = "/ms/impact/api/auth/google/start";
export const NEW_USER_WELCOME_URL = GOOGLE_AUTH_START; // Temporary

export const TWITTER_AUTH_START = "/ms/impact/api/auth/twitter/start";

export const FETCH_POTENTIAL_USER_DATA = `/ms/impact/api/auth/persevere`;

export const COMPLETE_REGISTRATION = `/ms/impact/api/auth/register/complete`;

export const POST_SINGLE_IMAGE_TO_STORAGE_BUCKET = `/ms/impact/api/storage/upload_single_image`;

export const POST_ADD_LISTING_PRODUCT_ITEMS = `/ms/impact/api/storage/add_listing_product_items`;

export const BUY_LISTING = (listingId: string) =>
  `/ms/impact/api/payments/checkout/${listingId}`;

export const SERVE_PRODUCT_ITEM_FILE = (
  buyInstanceId: string,
  productItemId: string
) => `/ms/impact/api/storage/getProduct/${buyInstanceId}/${productItemId}`;

export const CHAT_DETAILED_SCREEN = (buyInstanceId: string) =>
  `/chat/${buyInstanceId}`;

// Only two people can join? : Incase of listing service
// Multiple people can join: Incase of event
export const VIDEO_SESSION_START = (buyInstanceId: string) =>
  `/meet/${buyInstanceId}`;

export const LISTINGS_BOUGHT_BY_ME = `/listings/bought_by_me`;
export const ALL_EVENTS_REGISTERED = `/events/i_am_registered`;
export const ALL_CHAT_SESSIONS = `/chat/all`;
