import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type AuthUserEventState = {
  __typename?: 'AuthUserEventState';
  event_id: Scalars['ID'];
  is_registered: Scalars['Boolean'];
  joining_info?: Maybe<EventJoiningInfo>;
};

export type AuthUserPostState = {
  __typename?: 'AuthUserPostState';
  is_post_liked_by_me: Scalars['Boolean'];
  post_id: Scalars['ID'];
};

export type AuthUserProductListingState = {
  __typename?: 'AuthUserProductListingState';
  is_purchased: Scalars['Boolean'];
  items?: Maybe<Array<ProductItem>>;
  product_id: Scalars['ID'];
};

export type AuthUserServiceListingState = {
  __typename?: 'AuthUserServiceListingState';
  is_purchased: Scalars['Boolean'];
  scheduled_meet_time?: Maybe<Scalars['String']>;
  service_id: Scalars['ID'];
};

export type BuyProductResponse = {
  __typename?: 'BuyProductResponse';
  payment_gateway_url: Scalars['String'];
};

export type CreateOrEditEventInput = {
  event_id?: InputMaybe<Scalars['String']>;
};

export type CreateOrEditListingInput = {
  listing_id?: InputMaybe<Scalars['String']>;
  listing_type: ListingType;
};

export type CreateOrEditPostInput = {
  cover_image_url: Scalars['String'];
  desc_full_markdown: Scalars['String'];
  post_id?: InputMaybe<Scalars['String']>;
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type Event = {
  __typename?: 'Event';
  cover_image_url: Scalars['String'];
  desc_full_markdown: Scalars['String'];
  duration_in_minutes: Scalars['Int'];
  event_id: Scalars['ID'];
  event_start_time: Scalars['String'];
  is_member_only_event?: Maybe<Scalars['Boolean']>;
  location_type: EventLocationType;
  number_of_registrations: Scalars['Int'];
  organizer: UserPublicInfo;
  show_in_discover: Scalars['Boolean'];
  title: Scalars['String'];
};

export type EventJoiningInfo = {
  __typename?: 'EventJoiningInfo';
  address?: Maybe<Scalars['String']>;
  event_url?: Maybe<Scalars['String']>;
};

export enum EventLocationType {
  InPerson = 'IN_PERSON',
  Virtual = 'VIRTUAL'
}

export type Listing = {
  __typename?: 'Listing';
  author: UserPublicInfo;
  cover_image_url: Scalars['String'];
  is_chat_support_available: Scalars['Boolean'];
  is_video_support_available: Scalars['Boolean'];
  listing_id: Scalars['ID'];
  number_of_reviews: Scalars['Int'];
  price: Scalars['Float'];
  price_currency: PriceCurrency;
  reviews_score: Scalars['Float'];
  title: Scalars['String'];
  type: ListingType;
};

export enum ListingType {
  VirtualProduct = 'VIRTUAL_PRODUCT',
  VirtualService = 'VIRTUAL_SERVICE'
}

export type Mutation = {
  __typename?: 'Mutation';
  buyProduct: BuyProductResponse;
  createOrEditEvent: Event;
  createOrEditPost: Post;
  createOrEditProductListing: Listing;
  createOrEditServiceListing: Listing;
  registerForEvent: Scalars['Boolean'];
  sendMessage: Scalars['Boolean'];
  submitListingReview: Review;
  submitPostComment: PostComment;
  togglePostLike: Scalars['Boolean'];
};


export type MutationBuyProductArgs = {
  product_listing_id: Scalars['String'];
};


export type MutationCreateOrEditEventArgs = {
  payload: CreateOrEditEventInput;
};


export type MutationCreateOrEditPostArgs = {
  payload: CreateOrEditPostInput;
};


export type MutationCreateOrEditProductListingArgs = {
  payload: CreateOrEditListingInput;
};


export type MutationCreateOrEditServiceListingArgs = {
  payload: CreateOrEditListingInput;
};


export type MutationRegisterForEventArgs = {
  event_id: Scalars['String'];
};


export type MutationSendMessageArgs = {
  listing_id: Scalars['String'];
  message: Scalars['String'];
};


export type MutationSubmitListingReviewArgs = {
  payload: ReviewInput;
};


export type MutationSubmitPostCommentArgs = {
  payload: PostCommentInput;
};


export type MutationTogglePostLikeArgs = {
  post_id: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  approx_read_time_in_minutes: Scalars['Int'];
  comments: Array<PostComment>;
  cover_image_url: Scalars['String'];
  creator_id: Scalars['String'];
  creator_info: UserPublicInfo;
  desc_full_markdown: Scalars['String'];
  desc_mini: Scalars['String'];
  liked_by_count: Scalars['Int'];
  number_of_comments: Scalars['Int'];
  post_id: Scalars['ID'];
  published_on: Scalars['String'];
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type PostComment = {
  __typename?: 'PostComment';
  comment: Scalars['String'];
  comment_id: Scalars['ID'];
  commented_at: Scalars['String'];
  post_id: Scalars['ID'];
  posted_by: UserPublicInfo;
  posted_by_user_id: Scalars['String'];
};

export type PostCommentInput = {
  comment: Scalars['String'];
  post_id: Scalars['String'];
};

export enum PriceCurrency {
  Inr = 'INR'
}

export type ProductItem = {
  __typename?: 'ProductItem';
  product_id: Scalars['ID'];
  product_url: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  authUserEventState?: Maybe<AuthUserEventState>;
  authUserPostState?: Maybe<AuthUserPostState>;
  authUserProductListingState?: Maybe<AuthUserProductListingState>;
  authUserServiceListingState?: Maybe<AuthUserServiceListingState>;
  getCurrentUser?: Maybe<UserInstance>;
  getEventInfoById: Event;
  getEventsInWall?: Maybe<Array<Event>>;
  getEventsRegistered: Array<Maybe<Event>>;
  getFeaturedEvents: Array<Maybe<Event>>;
  getFeaturedListings: Array<Maybe<Listing>>;
  getFeaturedPosts: Array<Maybe<Post>>;
  getListingInfoById: Listing;
  getListingsBought: Array<Maybe<Listing>>;
  getListingsInWall?: Maybe<Array<Listing>>;
  getMySubscribers: Array<Maybe<UserPublicInfo>>;
  getPostComments: Array<PostComment>;
  getPostInfoById: Post;
  getPostTags: Array<Scalars['String']>;
  getPostsInWall?: Maybe<Array<Post>>;
  getRecentEvents: Array<Maybe<Event>>;
  getRecentListings: Array<Maybe<Listing>>;
  getRecentPosts: Array<Maybe<Post>>;
  getReviewsOfListing: Array<Maybe<Review>>;
  getSubscribedUsers: Array<Maybe<UserPublicInfo>>;
};


export type QueryAuthUserEventStateArgs = {
  event_id: Scalars['String'];
};


export type QueryAuthUserPostStateArgs = {
  post_id: Scalars['String'];
};


export type QueryAuthUserProductListingStateArgs = {
  product_listing_id: Scalars['String'];
};


export type QueryAuthUserServiceListingStateArgs = {
  service_listing_id: Scalars['String'];
};


export type QueryGetEventInfoByIdArgs = {
  event_id: Scalars['String'];
};


export type QueryGetEventsInWallArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  wall_id: Scalars['String'];
};


export type QueryGetEventsRegisteredArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetFeaturedEventsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetFeaturedListingsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetFeaturedPostsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetListingInfoByIdArgs = {
  listing_id: Scalars['String'];
};


export type QueryGetListingsBoughtArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetListingsInWallArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  wall_id: Scalars['String'];
};


export type QueryGetMySubscribersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetPostCommentsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  post_id: Scalars['String'];
};


export type QueryGetPostInfoByIdArgs = {
  post_id: Scalars['String'];
};


export type QueryGetPostTagsArgs = {
  query: Scalars['String'];
};


export type QueryGetPostsInWallArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  wall_id: Scalars['String'];
};


export type QueryGetRecentEventsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetRecentListingsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetRecentPostsArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetReviewsOfListingArgs = {
  limit: Scalars['Int'];
  listing_id: Scalars['String'];
  offset: Scalars['Int'];
};


export type QueryGetSubscribedUsersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};

export type Review = {
  __typename?: 'Review';
  listing_id: Scalars['String'];
  listing_type: ListingType;
  review_by: UserPublicInfo;
  review_id: Scalars['ID'];
  text: Scalars['String'];
};

export type ReviewInput = {
  listing_id: Scalars['String'];
  review: Scalars['String'];
};

export type UserInstance = {
  __typename?: 'UserInstance';
  avatar_url: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ID'];
  is_google_account_connected: Scalars['Boolean'];
  name: Scalars['String'];
  twitter_user_name?: Maybe<Scalars['String']>;
};

export type UserPublicInfo = {
  __typename?: 'UserPublicInfo';
  avatar_url: Scalars['String'];
  name: Scalars['String'];
  user_id: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthUserEventState: ResolverTypeWrapper<AuthUserEventState>;
  AuthUserPostState: ResolverTypeWrapper<AuthUserPostState>;
  AuthUserProductListingState: ResolverTypeWrapper<AuthUserProductListingState>;
  AuthUserServiceListingState: ResolverTypeWrapper<AuthUserServiceListingState>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  BuyProductResponse: ResolverTypeWrapper<BuyProductResponse>;
  CreateOrEditEventInput: CreateOrEditEventInput;
  CreateOrEditListingInput: CreateOrEditListingInput;
  CreateOrEditPostInput: CreateOrEditPostInput;
  Event: ResolverTypeWrapper<Event>;
  EventJoiningInfo: ResolverTypeWrapper<EventJoiningInfo>;
  EventLocationType: EventLocationType;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Listing: ResolverTypeWrapper<Listing>;
  ListingType: ListingType;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostComment: ResolverTypeWrapper<PostComment>;
  PostCommentInput: PostCommentInput;
  PriceCurrency: PriceCurrency;
  ProductItem: ResolverTypeWrapper<ProductItem>;
  Query: ResolverTypeWrapper<{}>;
  Review: ResolverTypeWrapper<Review>;
  ReviewInput: ReviewInput;
  String: ResolverTypeWrapper<Scalars['String']>;
  UserInstance: ResolverTypeWrapper<UserInstance>;
  UserPublicInfo: ResolverTypeWrapper<UserPublicInfo>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthUserEventState: AuthUserEventState;
  AuthUserPostState: AuthUserPostState;
  AuthUserProductListingState: AuthUserProductListingState;
  AuthUserServiceListingState: AuthUserServiceListingState;
  Boolean: Scalars['Boolean'];
  BuyProductResponse: BuyProductResponse;
  CreateOrEditEventInput: CreateOrEditEventInput;
  CreateOrEditListingInput: CreateOrEditListingInput;
  CreateOrEditPostInput: CreateOrEditPostInput;
  Event: Event;
  EventJoiningInfo: EventJoiningInfo;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Listing: Listing;
  Mutation: {};
  Post: Post;
  PostComment: PostComment;
  PostCommentInput: PostCommentInput;
  ProductItem: ProductItem;
  Query: {};
  Review: Review;
  ReviewInput: ReviewInput;
  String: Scalars['String'];
  UserInstance: UserInstance;
  UserPublicInfo: UserPublicInfo;
};

export type AuthUserEventStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserEventState'] = ResolversParentTypes['AuthUserEventState']> = {
  event_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_registered?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  joining_info?: Resolver<Maybe<ResolversTypes['EventJoiningInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthUserPostStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserPostState'] = ResolversParentTypes['AuthUserPostState']> = {
  is_post_liked_by_me?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthUserProductListingStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserProductListingState'] = ResolversParentTypes['AuthUserProductListingState']> = {
  is_purchased?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  items?: Resolver<Maybe<Array<ResolversTypes['ProductItem']>>, ParentType, ContextType>;
  product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthUserServiceListingStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserServiceListingState'] = ResolversParentTypes['AuthUserServiceListingState']> = {
  is_purchased?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  scheduled_meet_time?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  service_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type BuyProductResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['BuyProductResponse'] = ResolversParentTypes['BuyProductResponse']> = {
  payment_gateway_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventResolvers<ContextType = any, ParentType extends ResolversParentTypes['Event'] = ResolversParentTypes['Event']> = {
  cover_image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  desc_full_markdown?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  duration_in_minutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  event_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  event_start_time?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_member_only_event?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  location_type?: Resolver<ResolversTypes['EventLocationType'], ParentType, ContextType>;
  number_of_registrations?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  organizer?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  show_in_discover?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventJoiningInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventJoiningInfo'] = ResolversParentTypes['EventJoiningInfo']> = {
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  event_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Listing'] = ResolversParentTypes['Listing']> = {
  author?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  cover_image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  is_chat_support_available?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_video_support_available?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  listing_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  number_of_reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  price_currency?: Resolver<ResolversTypes['PriceCurrency'], ParentType, ContextType>;
  reviews_score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ListingType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  buyProduct?: Resolver<ResolversTypes['BuyProductResponse'], ParentType, ContextType, RequireFields<MutationBuyProductArgs, 'product_listing_id'>>;
  createOrEditEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationCreateOrEditEventArgs, 'payload'>>;
  createOrEditPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreateOrEditPostArgs, 'payload'>>;
  createOrEditProductListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationCreateOrEditProductListingArgs, 'payload'>>;
  createOrEditServiceListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationCreateOrEditServiceListingArgs, 'payload'>>;
  registerForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterForEventArgs, 'event_id'>>;
  sendMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'listing_id' | 'message'>>;
  submitListingReview?: Resolver<ResolversTypes['Review'], ParentType, ContextType, RequireFields<MutationSubmitListingReviewArgs, 'payload'>>;
  submitPostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationSubmitPostCommentArgs, 'payload'>>;
  togglePostLike?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTogglePostLikeArgs, 'post_id'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  approx_read_time_in_minutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['PostComment']>, ParentType, ContextType>;
  cover_image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator_info?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  desc_full_markdown?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  desc_mini?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  liked_by_count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  number_of_comments?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  published_on?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  show_in_discover?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostCommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['PostComment'] = ResolversParentTypes['PostComment']> = {
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  comment_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  commented_at?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  post_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  posted_by?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  posted_by_user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductItem'] = ResolversParentTypes['ProductItem']> = {
  product_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  product_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authUserEventState?: Resolver<Maybe<ResolversTypes['AuthUserEventState']>, ParentType, ContextType, RequireFields<QueryAuthUserEventStateArgs, 'event_id'>>;
  authUserPostState?: Resolver<Maybe<ResolversTypes['AuthUserPostState']>, ParentType, ContextType, RequireFields<QueryAuthUserPostStateArgs, 'post_id'>>;
  authUserProductListingState?: Resolver<Maybe<ResolversTypes['AuthUserProductListingState']>, ParentType, ContextType, RequireFields<QueryAuthUserProductListingStateArgs, 'product_listing_id'>>;
  authUserServiceListingState?: Resolver<Maybe<ResolversTypes['AuthUserServiceListingState']>, ParentType, ContextType, RequireFields<QueryAuthUserServiceListingStateArgs, 'service_listing_id'>>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['UserInstance']>, ParentType, ContextType>;
  getEventInfoById?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryGetEventInfoByIdArgs, 'event_id'>>;
  getEventsInWall?: Resolver<Maybe<Array<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryGetEventsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getEventsRegistered?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryGetEventsRegisteredArgs, 'limit' | 'offset'>>;
  getFeaturedEvents?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryGetFeaturedEventsArgs, 'limit' | 'offset'>>;
  getFeaturedListings?: Resolver<Array<Maybe<ResolversTypes['Listing']>>, ParentType, ContextType, RequireFields<QueryGetFeaturedListingsArgs, 'limit' | 'offset'>>;
  getFeaturedPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetFeaturedPostsArgs, 'limit' | 'offset'>>;
  getListingInfoById?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<QueryGetListingInfoByIdArgs, 'listing_id'>>;
  getListingsBought?: Resolver<Array<Maybe<ResolversTypes['Listing']>>, ParentType, ContextType, RequireFields<QueryGetListingsBoughtArgs, 'limit' | 'offset'>>;
  getListingsInWall?: Resolver<Maybe<Array<ResolversTypes['Listing']>>, ParentType, ContextType, RequireFields<QueryGetListingsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getMySubscribers?: Resolver<Array<Maybe<ResolversTypes['UserPublicInfo']>>, ParentType, ContextType, RequireFields<QueryGetMySubscribersArgs, 'limit' | 'offset'>>;
  getPostComments?: Resolver<Array<ResolversTypes['PostComment']>, ParentType, ContextType, RequireFields<QueryGetPostCommentsArgs, 'limit' | 'offset' | 'post_id'>>;
  getPostInfoById?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryGetPostInfoByIdArgs, 'post_id'>>;
  getPostTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetPostTagsArgs, 'query'>>;
  getPostsInWall?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetPostsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getRecentEvents?: Resolver<Array<Maybe<ResolversTypes['Event']>>, ParentType, ContextType, RequireFields<QueryGetRecentEventsArgs, 'limit' | 'offset'>>;
  getRecentListings?: Resolver<Array<Maybe<ResolversTypes['Listing']>>, ParentType, ContextType, RequireFields<QueryGetRecentListingsArgs, 'limit' | 'offset'>>;
  getRecentPosts?: Resolver<Array<Maybe<ResolversTypes['Post']>>, ParentType, ContextType, RequireFields<QueryGetRecentPostsArgs, 'limit' | 'offset'>>;
  getReviewsOfListing?: Resolver<Array<Maybe<ResolversTypes['Review']>>, ParentType, ContextType, RequireFields<QueryGetReviewsOfListingArgs, 'limit' | 'listing_id' | 'offset'>>;
  getSubscribedUsers?: Resolver<Array<Maybe<ResolversTypes['UserPublicInfo']>>, ParentType, ContextType, RequireFields<QueryGetSubscribedUsersArgs, 'limit' | 'offset'>>;
};

export type ReviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['Review'] = ResolversParentTypes['Review']> = {
  listing_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listing_type?: Resolver<ResolversTypes['ListingType'], ParentType, ContextType>;
  review_by?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  review_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserInstanceResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserInstance'] = ResolversParentTypes['UserInstance']> = {
  avatar_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_google_account_connected?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  twitter_user_name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserPublicInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['UserPublicInfo'] = ResolversParentTypes['UserPublicInfo']> = {
  avatar_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthUserEventState?: AuthUserEventStateResolvers<ContextType>;
  AuthUserPostState?: AuthUserPostStateResolvers<ContextType>;
  AuthUserProductListingState?: AuthUserProductListingStateResolvers<ContextType>;
  AuthUserServiceListingState?: AuthUserServiceListingStateResolvers<ContextType>;
  BuyProductResponse?: BuyProductResponseResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventJoiningInfo?: EventJoiningInfoResolvers<ContextType>;
  Listing?: ListingResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostComment?: PostCommentResolvers<ContextType>;
  ProductItem?: ProductItemResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  UserInstance?: UserInstanceResolvers<ContextType>;
  UserPublicInfo?: UserPublicInfoResolvers<ContextType>;
};

