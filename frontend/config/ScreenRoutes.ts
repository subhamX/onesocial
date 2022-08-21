


export const NEW_USER_WELCOME_URL = '/auth/welcome'

export const DASHBOARD_URL = '/dash'


export const BLOG_URL = '#'

export const LANDING_PAGE='/'

export const LOGOUT_URL='/api/auth/logout'


export const MY_PROFILE_PROXY='/profile/me'


export const USER_WALL_SCREEN=(wallId: string) => `/u/${wallId}`


export const FEATURES_URL_HASH = '/#features'


export const DETAILED_POST = (post_id: string) => `/posts/${post_id}`
export const CREATE_NEW_POST =  `/posts/new`



export const DETAILED_EVENT = (eventId: string) => `/events/${eventId}`

export const DETAILED_PRODUCT_AND_SERVICES = (type:"virtual_product" | "virtual_service", id: string) => `/listings/${type==='virtual_product'? 'p': 's'}/${id}`





export const GOOGLE_AUTH_START='/api/auth/google/start'
export const TWITTER_AUTH_START='/api/auth/twitter/start'



export const FETCH_POTENTIAL_USER_DATA = `/api/auth/persevere`

export const COMPLETE_REGISTRATION = `/api/auth/register/complete`

export const POST_SINGLE_IMAGE_TO_STORAGE_BUCKET = `/api/storage/upload_single_image`
