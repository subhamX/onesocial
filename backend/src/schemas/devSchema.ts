import {gql} from 'apollo-server-express'

export const devSchema = gql`
    # All NULL values must explain, when they can be NULL
    # ! HEY_TODO: are things which need attention

    # we're also using it to fetch basic details which are shown in the user's wall
    type UserPublicInfo{
        name: String! # just name, no need to ask for fName, lName
        user_id: String! # aka unique wall id aka username
        avatar_url: String!
        tagline: String!
    }

    type Post{
        post_id: ID!
        creator_id: ID!
        creator_info: UserPublicInfo!

        title: String!
        desc_mini: String! # to be used by post tiles
        desc_full_markdown: String!
        cover_image_url: String!

        liked_by_count: Int!
        published_on: String!
        number_of_comments: Int!
        approx_read_time_in_minutes: Int!

        show_in_discover: Boolean!

        comments: [PostComment!]!

        tags: [String!]!
    }

    type PostComment {
        comment_id: ID!
        post_id: ID!
        comment: String!
        posted_by: UserPublicInfo!
        posted_by_user_id: String!
        commented_at: String!
    }

    type AuthUserPostState {
        # No need of ID? But caching might be difficult so adding one
        post_id: ID!
        is_post_liked_by_me: Boolean!
    }


    enum EventLocationType {
        VIRTUAL
        IN_PERSON
    }

    type Event{
        show_in_discover: Boolean!
        is_member_only_event: Boolean # if this is true then show_in_discover will definitely be false

        event_id: ID!

        title: String!
        event_start_time: String!
        duration_in_minutes: Int!
        cover_image_url: String!
        location_type: EventLocationType!
        desc_full_markdown: String!

        number_of_registrations: Int!
        # number_of_approved_guests: Int! # TODO: [Future] There is no concept of approval right now!!!!!!

        organizer_id: String!
        organizer: UserPublicInfo! # Currently we will have a single organizer
        # TODO: Shall we also support event which don't require registration?

        tags: [String!]!
    }


    type EventJoiningInfo{
        # TODO: Do I need an ID there? for apollo cache
        event_url: String # will be not NULL for VIRTUAL event
        address: String # will be not NULL for IN_PERSON event
        additional_info: String # author can add some text details which are secret
    }


    type AuthUserEventState{
        # No need of ID? But caching might be difficult so adding one
        event_id: ID!
        is_registered: Boolean!
        joining_info: EventJoiningInfo # we might now have joining info if is_registered is false
        is_user_a_follower: Boolean! # don't think that since we've got [isCurrentUserASubscriber] we don't need it; problem is event/id doesn't have a wall_id
    }


    enum ListingType {
        DIGITAL_PRODUCT
        SERVICE
    }

    enum PriceCurrency {
        USD
        INR
    }

    type Listing {
        id: ID!

        currency: PriceCurrency!
        desc_full_markdown: String!


        listing_type: ListingType!
        name: String!
        price: Float!
        show_in_discover: Boolean!
        cover_image_url: String!
        
        reviews_score: Float!
        number_of_reviews: Int!

        author_id: String!
        author: UserPublicInfo!
        tags: [String!]!

        # valid only for digital product listings
        number_of_product_items: Int!
        product_items: [ListingProductItem!]!

        # valid only for services listings
        includes_chat_support: Boolean!
        includes_video_call_support: Boolean!
        video_duration: Int! # it will be 0 if [includes_video_call_support] is false

        buy_instance_id: String! # it will be "" if the user is not logged in

        is_published: Boolean!
        published_at: String # can be null if it's not published yet 
    }

    type ListingProductItem{
        id: ID! # can be used to get the file; we will check access before we serve it
        listing_id: String!
        file_name: String!
        description: String!
    }

    # type AuthUserProductListingState{
    #     product_id: ID!
    #     is_purchased: Boolean!
    #     items: [ProductItem!] # this will be null if is_purchased is false
    # }

    # type AuthUserServiceListingState{
    #     service_id: ID!
    #     is_purchased: Boolean!
    #     # TODO: add CHAT support details
    #     scheduled_meet_time: String # this will be null if is_purchased is false
    # }

    type Review{
        # review schema is same for product and service
        review_id: ID!
        listing_id: String!
        listing_type: ListingType!
        text: String!
        # TODO: files upload support? No. What if the person adds the file itself?
        review_by: UserPublicInfo!
    }

    type Query{
        getUserInfoByWallId(wall_id: String!): UserPublicInfo! # ✅
        isCurrentUserASubscriber(wall_id: String!): Boolean! # ✅ we shall return false if user is not logged in or not a subscriber

        getEventsInWall(offset: Int!, limit: Int!, wall_id: String!): [Event!]! # ✅
        getEventInfoById(event_id: String!): Event! # ✅
        getEventTags(query: String!): [String!]! # ✅


        getListingsInWall(offset: Int!, limit: Int!, wall_id: String!): [Listing!]! # ✅
        getListingInfoById(listing_id: String!): Listing! # ✅
        getListingTags(query: String!): [String!]! # ✅

        getReviewsOfListing(offset: Int!, limit: Int!, listing_id: String!): [Review]!

        getPostsInWall(offset: Int!, limit: Int!, wall_id: String!): [Post!]! # ✅
        getPostInfoById(post_id: String!): Post! # ✅
        getPostComments(offset: Int!, limit: Int!, post_id: String!): [PostComment!]! # ✅
        getPostTags(query: String!): [String!]! # ✅

        # requires auth; if not we send NULL
        authUserPostState(post_id: String!): AuthUserPostState # ✅
        authUserEventState(event_id: String!): AuthUserEventState # ✅
        # authUserProductListingState(product_listing_id: String!): AuthUserProductListingState
        # authUserServiceListingState(service_listing_id: String!): AuthUserServiceListingState


        # users
        ## Discover routes    
        getFeaturedPosts(offset: Int!, limit: Int!): [Post]!
        getRecentPosts(offset: Int!, limit: Int!): [Post]!

        getFeaturedEvents(offset: Int!, limit: Int!): [Event]!
        getRecentEvents(offset: Int!, limit: Int!): [Event]!

        getFeaturedListings(offset: Int!, limit: Int!): [Listing]!
        getRecentListings(offset: Int!, limit: Int!): [Listing]!


        getListingsBought(offset: Int!, limit: Int!): [Listing]!
        getEventsRegistered(offset: Int!, limit: Int!): [Event]!
        # getPostsLiked(offset: Int!, limit: Int!): [Posts]! # TODO: Next version

        # We currently don't have any intention to show the subscribers and people you're subscribing to public! Only the creator can see it.
        getSubscribedUsers(offset: Int!, limit: Int!): [UserPublicInfo]!
        getMySubscribers(offset: Int!, limit: Int!): [UserPublicInfo]!
    }


    # ##### ! Mutations BEGIN


    input ReviewInput{
        listing_id: String!
        review: String!
        # TODO: file upload
    }

    input PostCommentInput{
        post_id: String!
        comment: String!
    }


    input CreateOrEditPostInput{
        post_id: String # incase of create it will be NULL
        title: String!
        desc_full_markdown: String!
        cover_image_url: String! # UPLOAD; 
        show_in_discover: Boolean!
        tags: [String!]!
    }

    input CreateOrEditEventInput{
        event_id: String # incase of create it will be NULL
        show_in_discover: Boolean!
        is_member_only_event: Boolean!
        title: String!
        event_start_time: String!
        duration_in_minutes: Int!
        cover_image_url: String!
        location_type: EventLocationType!
        desc_full_markdown: String!
        tags: [String!]!
        event_url: String 
        address: String
        additional_info: String!
    }

    
    input CreateOrEditListingInput{
        id: ID

        currency: PriceCurrency!
        desc_full_markdown: String!
        includes_chat_support: Boolean!
        includes_video_call_support: Boolean!
        listing_type: ListingType!
        name: String!
        price: Float!
        show_in_discover: Boolean!
        video_duration: Int! # it will be 0 if [includes_video_call_support] is false
        cover_image_url: String!
        tags: [String!]!

    }

    input ListingProductItemMetadata{
        id: String!
        file_name: String!
        description: String!
    }

    input EditListingProductItemsMetaData{
        listing_id: String!
        items: [ListingProductItemMetadata!]!
    }
    # ! HEY_TODO
    # type Subscription{
    #     # chat subscription
    #     # ensure that we allow chat subscription only in certain cases;
    # }

    type BuyProductResponse {
        payment_gateway_url: String!
    }

    type Mutation{
        buyProduct(product_listing_id: String!): BuyProductResponse!

        # TODO: buyService(service_listing_id: String!, scheduled_meet_slot: String): { # scheduled_meet_time will be a valid time slot
        # ! Currently meet scheduling must be done on chat!
        # Later we will have option to schedule, reSchedule

        # TODO: Currently, the chat/video support doesn't have an expiry. Maybe we should expire it if there is a continuos 7 days of inactivity

        toggleFollowAUser(wall_id: String!): Boolean! # ✅

        
        # TODO: File Upload
        sendMessage(listing_id: String!, message: String!): Boolean! # new message will automatically be sent using the Subscription


        # for users
        submitListingReview(payload: ReviewInput!): Review!


        togglePostLike(post_id:String!): Boolean! # ✅ returns the new state
        submitPostComment(payload: PostCommentInput!): PostComment! # ✅


        # currently we're not asking for any additional info
        registerForEvent(event_id:String!): Boolean! # ✅


        # for creators
        createOrEditPost(payload: CreateOrEditPostInput!): Post! # ✅
        createOrEditListing(payload: CreateOrEditListingInput!): Listing! # ✅
        editListingProductItemsMetaData(payload: EditListingProductItemsMetaData!): [ListingProductItem!]! # ✅
        deleteListingProductItem(listing_product_id: String!): Boolean! # ✅
        publishProductListing(listing_id: String!): Boolean! # ✅ Note that it's only valid for product listing, and not for service listing


        # createOrEditServiceListing(payload: CreateOrEditListingInput!): Listing!
        createOrEditEvent(payload: CreateOrEditEventInput!): Event! # ✅



        # TODO: Make listing and Product different; only while fetching make it one
    }




    # Currently you cannot delete Post, Event or Listings;

`
