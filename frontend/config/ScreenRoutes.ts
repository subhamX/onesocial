


export const NEW_USER_WELCOME_URL = '/auth/welcome'

export const DASHBOARD_URL = '/dash'


export const BLOG_URL = '#'



export const FEATURES_URL_HASH = '/#features'


export const DETAILED_POST = (post_id: string) => `/posts/${post_id}`

export const DETAILED_EVENT = (eventId: string) => `/events/${eventId}`

export const DETAILED_PRODUCT_AND_SERVICES = (type:"virtual_product" | "virtual_service", id: string) => `/listings/${type==='virtual_product'? 'p': 's'}/${id}`



