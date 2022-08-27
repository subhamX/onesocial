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
  is_user_a_follower: Scalars['Boolean'];
  joining_info?: Maybe<EventJoiningInfo>;
};

export type AuthUserPostState = {
  __typename?: 'AuthUserPostState';
  is_post_liked_by_me: Scalars['Boolean'];
  post_id: Scalars['ID'];
};

export type CreateOrEditEventInput = {
  additional_info: Scalars['String'];
  address?: InputMaybe<Scalars['String']>;
  cover_image_url: Scalars['String'];
  desc_full_markdown: Scalars['String'];
  duration_in_minutes: Scalars['Int'];
  event_id?: InputMaybe<Scalars['String']>;
  event_start_time: Scalars['String'];
  event_url?: InputMaybe<Scalars['String']>;
  is_member_only_event: Scalars['Boolean'];
  location_type: EventLocationType;
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type CreateOrEditListingInput = {
  cover_image_url: Scalars['String'];
  currency: PriceCurrency;
  desc_full_markdown: Scalars['String'];
  id?: InputMaybe<Scalars['ID']>;
  includes_chat_support: Scalars['Boolean'];
  includes_video_call_support: Scalars['Boolean'];
  listing_type: ListingType;
  name: Scalars['String'];
  price: Scalars['Float'];
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  video_duration: Scalars['Int'];
};

export type CreateOrEditPostInput = {
  cover_image_url: Scalars['String'];
  desc_full_markdown: Scalars['String'];
  post_id?: InputMaybe<Scalars['String']>;
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type EditListingProductItemsMetaData = {
  items: Array<ListingProductItemMetadata>;
  listing_id: Scalars['String'];
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
  organizer_id: Scalars['String'];
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  title: Scalars['String'];
};

export type EventJoiningInfo = {
  __typename?: 'EventJoiningInfo';
  additional_info?: Maybe<Scalars['String']>;
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
  author_id: Scalars['String'];
  buy_instance_id: Scalars['String'];
  cover_image_url: Scalars['String'];
  currency: PriceCurrency;
  desc_full_markdown: Scalars['String'];
  id: Scalars['ID'];
  includes_chat_support: Scalars['Boolean'];
  includes_video_call_support: Scalars['Boolean'];
  is_published: Scalars['Boolean'];
  listing_type: ListingType;
  name: Scalars['String'];
  number_of_product_items: Scalars['Int'];
  number_of_reviews: Scalars['Int'];
  price: Scalars['Float'];
  product_items: Array<ListingProductItem>;
  published_at?: Maybe<Scalars['String']>;
  reviews_score: Scalars['Float'];
  show_in_discover: Scalars['Boolean'];
  tags: Array<Scalars['String']>;
  video_duration: Scalars['Int'];
};

export type ListingCustomer = {
  __typename?: 'ListingCustomer';
  buy_instance_id: Scalars['String'];
  buyer: UserPublicInfo;
  buyer_id: Scalars['String'];
  listing: Listing;
  listing_id: Scalars['String'];
};

export type ListingProductItem = {
  __typename?: 'ListingProductItem';
  description: Scalars['String'];
  file_name: Scalars['String'];
  id: Scalars['ID'];
  listing_id: Scalars['String'];
};

export type ListingProductItemMetadata = {
  description: Scalars['String'];
  file_name: Scalars['String'];
  id: Scalars['String'];
};

export enum ListingType {
  DigitalProduct = 'DIGITAL_PRODUCT',
  Service = 'SERVICE'
}

export type Mutation = {
  __typename?: 'Mutation';
  createOrEditEvent: Event;
  createOrEditListing: Listing;
  createOrEditPost: Post;
  deleteListingProductItem: Scalars['Boolean'];
  editListingProductItemsMetaData: Array<ListingProductItem>;
  publishProductListing: Scalars['Boolean'];
  registerForEvent: Scalars['Boolean'];
  sendEmailToEventGuests: Scalars['Boolean'];
  sendMessage: Scalars['Boolean'];
  submitPostComment: PostComment;
  toggleFollowAUser: Scalars['Boolean'];
  togglePostLike: Scalars['Boolean'];
};


export type MutationCreateOrEditEventArgs = {
  payload: CreateOrEditEventInput;
};


export type MutationCreateOrEditListingArgs = {
  payload: CreateOrEditListingInput;
};


export type MutationCreateOrEditPostArgs = {
  payload: CreateOrEditPostInput;
};


export type MutationDeleteListingProductItemArgs = {
  listing_product_id: Scalars['String'];
};


export type MutationEditListingProductItemsMetaDataArgs = {
  payload: EditListingProductItemsMetaData;
};


export type MutationPublishProductListingArgs = {
  listing_id: Scalars['String'];
};


export type MutationRegisterForEventArgs = {
  event_id: Scalars['String'];
};


export type MutationSendEmailToEventGuestsArgs = {
  event_id: Scalars['String'];
  message: Scalars['String'];
};


export type MutationSendMessageArgs = {
  listing_id: Scalars['String'];
  message: Scalars['String'];
};


export type MutationSubmitPostCommentArgs = {
  payload: PostCommentInput;
};


export type MutationToggleFollowAUserArgs = {
  wall_id: Scalars['String'];
};


export type MutationTogglePostLikeArgs = {
  post_id: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  approx_read_time_in_minutes: Scalars['Int'];
  comments: Array<PostComment>;
  cover_image_url: Scalars['String'];
  creator_id: Scalars['ID'];
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
  Inr = 'INR',
  Usd = 'USD'
}

export type Query = {
  __typename?: 'Query';
  authUserEventState?: Maybe<AuthUserEventState>;
  authUserPostState?: Maybe<AuthUserPostState>;
  fetchEvents: Array<Event>;
  fetchListings: Array<Listing>;
  fetchPosts: Array<Post>;
  getAllCustomers: Array<ListingCustomer>;
  getCurrentUser?: Maybe<UserInstance>;
  getEventInfoById: Event;
  getEventTags: Array<Scalars['String']>;
  getEventsInWall: Array<Event>;
  getEventsRegistered: Array<Event>;
  getListingBuyers: Array<UserPublicInfo>;
  getListingInfoById: Listing;
  getListingTags: Array<Scalars['String']>;
  getListingsBought: Array<Listing>;
  getListingsInWall: Array<Listing>;
  getMyFollowers: Array<UserPublicInfo>;
  getMyFollowings: Array<UserPublicInfo>;
  getPostComments: Array<PostComment>;
  getPostInfoById: Post;
  getPostTags: Array<Scalars['String']>;
  getPostsInWall: Array<Post>;
  getRegisteredGuestsInEvent: Array<UserPublicInfo>;
  getTrendingEventTags: Array<Scalars['String']>;
  getTrendingListingTags: Array<Scalars['String']>;
  getTrendingPostsTags: Array<Scalars['String']>;
  getUserInfoByWallId: UserPublicInfo;
  isCurrentUserASubscriber: Scalars['Boolean'];
};


export type QueryAuthUserEventStateArgs = {
  event_id: Scalars['String'];
};


export type QueryAuthUserPostStateArgs = {
  post_id: Scalars['String'];
};


export type QueryFetchEventsArgs = {
  payload: QueryEntityInput;
};


export type QueryFetchListingsArgs = {
  payload: QueryEntityInput;
};


export type QueryFetchPostsArgs = {
  payload: QueryEntityInput;
};


export type QueryGetAllCustomersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetEventInfoByIdArgs = {
  event_id: Scalars['String'];
};


export type QueryGetEventTagsArgs = {
  query: Scalars['String'];
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


export type QueryGetListingBuyersArgs = {
  limit: Scalars['Int'];
  listing_id: Scalars['String'];
  offset: Scalars['Int'];
};


export type QueryGetListingInfoByIdArgs = {
  listing_id: Scalars['String'];
};


export type QueryGetListingTagsArgs = {
  query: Scalars['String'];
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


export type QueryGetMyFollowersArgs = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
};


export type QueryGetMyFollowingsArgs = {
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


export type QueryGetRegisteredGuestsInEventArgs = {
  event_id: Scalars['String'];
};


export type QueryGetUserInfoByWallIdArgs = {
  wall_id: Scalars['String'];
};


export type QueryIsCurrentUserASubscriberArgs = {
  wall_id: Scalars['String'];
};

export type QueryEntityInput = {
  limit: Scalars['Int'];
  offset: Scalars['Int'];
  query: Scalars['String'];
  tags: Array<Scalars['String']>;
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
  tagline: Scalars['String'];
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
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateOrEditEventInput: CreateOrEditEventInput;
  CreateOrEditListingInput: CreateOrEditListingInput;
  CreateOrEditPostInput: CreateOrEditPostInput;
  EditListingProductItemsMetaData: EditListingProductItemsMetaData;
  Event: ResolverTypeWrapper<Event>;
  EventJoiningInfo: ResolverTypeWrapper<EventJoiningInfo>;
  EventLocationType: EventLocationType;
  Float: ResolverTypeWrapper<Scalars['Float']>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Listing: ResolverTypeWrapper<Listing>;
  ListingCustomer: ResolverTypeWrapper<ListingCustomer>;
  ListingProductItem: ResolverTypeWrapper<ListingProductItem>;
  ListingProductItemMetadata: ListingProductItemMetadata;
  ListingType: ListingType;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostComment: ResolverTypeWrapper<PostComment>;
  PostCommentInput: PostCommentInput;
  PriceCurrency: PriceCurrency;
  Query: ResolverTypeWrapper<{}>;
  QueryEntityInput: QueryEntityInput;
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
  Boolean: Scalars['Boolean'];
  CreateOrEditEventInput: CreateOrEditEventInput;
  CreateOrEditListingInput: CreateOrEditListingInput;
  CreateOrEditPostInput: CreateOrEditPostInput;
  EditListingProductItemsMetaData: EditListingProductItemsMetaData;
  Event: Event;
  EventJoiningInfo: EventJoiningInfo;
  Float: Scalars['Float'];
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Listing: Listing;
  ListingCustomer: ListingCustomer;
  ListingProductItem: ListingProductItem;
  ListingProductItemMetadata: ListingProductItemMetadata;
  Mutation: {};
  Post: Post;
  PostComment: PostComment;
  PostCommentInput: PostCommentInput;
  Query: {};
  QueryEntityInput: QueryEntityInput;
  Review: Review;
  ReviewInput: ReviewInput;
  String: Scalars['String'];
  UserInstance: UserInstance;
  UserPublicInfo: UserPublicInfo;
};

export type AuthUserEventStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserEventState'] = ResolversParentTypes['AuthUserEventState']> = {
  event_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  is_registered?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_user_a_follower?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  joining_info?: Resolver<Maybe<ResolversTypes['EventJoiningInfo']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthUserPostStateResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthUserPostState'] = ResolversParentTypes['AuthUserPostState']> = {
  is_post_liked_by_me?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  post_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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
  organizer_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  show_in_discover?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type EventJoiningInfoResolvers<ContextType = any, ParentType extends ResolversParentTypes['EventJoiningInfo'] = ResolversParentTypes['EventJoiningInfo']> = {
  additional_info?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  address?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  event_url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingResolvers<ContextType = any, ParentType extends ResolversParentTypes['Listing'] = ResolversParentTypes['Listing']> = {
  author?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  author_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buy_instance_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  cover_image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['PriceCurrency'], ParentType, ContextType>;
  desc_full_markdown?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  includes_chat_support?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  includes_video_call_support?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  is_published?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  listing_type?: Resolver<ResolversTypes['ListingType'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  number_of_product_items?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  number_of_reviews?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product_items?: Resolver<Array<ResolversTypes['ListingProductItem']>, ParentType, ContextType>;
  published_at?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  reviews_score?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  show_in_discover?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  video_duration?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingCustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListingCustomer'] = ResolversParentTypes['ListingCustomer']> = {
  buy_instance_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buyer?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType>;
  buyer_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  listing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType>;
  listing_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ListingProductItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['ListingProductItem'] = ResolversParentTypes['ListingProductItem']> = {
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  file_name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  listing_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createOrEditEvent?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<MutationCreateOrEditEventArgs, 'payload'>>;
  createOrEditListing?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<MutationCreateOrEditListingArgs, 'payload'>>;
  createOrEditPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationCreateOrEditPostArgs, 'payload'>>;
  deleteListingProductItem?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteListingProductItemArgs, 'listing_product_id'>>;
  editListingProductItemsMetaData?: Resolver<Array<ResolversTypes['ListingProductItem']>, ParentType, ContextType, RequireFields<MutationEditListingProductItemsMetaDataArgs, 'payload'>>;
  publishProductListing?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationPublishProductListingArgs, 'listing_id'>>;
  registerForEvent?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationRegisterForEventArgs, 'event_id'>>;
  sendEmailToEventGuests?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendEmailToEventGuestsArgs, 'event_id' | 'message'>>;
  sendMessage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationSendMessageArgs, 'listing_id' | 'message'>>;
  submitPostComment?: Resolver<ResolversTypes['PostComment'], ParentType, ContextType, RequireFields<MutationSubmitPostCommentArgs, 'payload'>>;
  toggleFollowAUser?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationToggleFollowAUserArgs, 'wall_id'>>;
  togglePostLike?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationTogglePostLikeArgs, 'post_id'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  approx_read_time_in_minutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['PostComment']>, ParentType, ContextType>;
  cover_image_url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creator_id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  authUserEventState?: Resolver<Maybe<ResolversTypes['AuthUserEventState']>, ParentType, ContextType, RequireFields<QueryAuthUserEventStateArgs, 'event_id'>>;
  authUserPostState?: Resolver<Maybe<ResolversTypes['AuthUserPostState']>, ParentType, ContextType, RequireFields<QueryAuthUserPostStateArgs, 'post_id'>>;
  fetchEvents?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryFetchEventsArgs, 'payload'>>;
  fetchListings?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType, RequireFields<QueryFetchListingsArgs, 'payload'>>;
  fetchPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryFetchPostsArgs, 'payload'>>;
  getAllCustomers?: Resolver<Array<ResolversTypes['ListingCustomer']>, ParentType, ContextType, RequireFields<QueryGetAllCustomersArgs, 'limit' | 'offset'>>;
  getCurrentUser?: Resolver<Maybe<ResolversTypes['UserInstance']>, ParentType, ContextType>;
  getEventInfoById?: Resolver<ResolversTypes['Event'], ParentType, ContextType, RequireFields<QueryGetEventInfoByIdArgs, 'event_id'>>;
  getEventTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetEventTagsArgs, 'query'>>;
  getEventsInWall?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryGetEventsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getEventsRegistered?: Resolver<Array<ResolversTypes['Event']>, ParentType, ContextType, RequireFields<QueryGetEventsRegisteredArgs, 'limit' | 'offset'>>;
  getListingBuyers?: Resolver<Array<ResolversTypes['UserPublicInfo']>, ParentType, ContextType, RequireFields<QueryGetListingBuyersArgs, 'limit' | 'listing_id' | 'offset'>>;
  getListingInfoById?: Resolver<ResolversTypes['Listing'], ParentType, ContextType, RequireFields<QueryGetListingInfoByIdArgs, 'listing_id'>>;
  getListingTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetListingTagsArgs, 'query'>>;
  getListingsBought?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType, RequireFields<QueryGetListingsBoughtArgs, 'limit' | 'offset'>>;
  getListingsInWall?: Resolver<Array<ResolversTypes['Listing']>, ParentType, ContextType, RequireFields<QueryGetListingsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getMyFollowers?: Resolver<Array<ResolversTypes['UserPublicInfo']>, ParentType, ContextType, RequireFields<QueryGetMyFollowersArgs, 'limit' | 'offset'>>;
  getMyFollowings?: Resolver<Array<ResolversTypes['UserPublicInfo']>, ParentType, ContextType, RequireFields<QueryGetMyFollowingsArgs, 'limit' | 'offset'>>;
  getPostComments?: Resolver<Array<ResolversTypes['PostComment']>, ParentType, ContextType, RequireFields<QueryGetPostCommentsArgs, 'limit' | 'offset' | 'post_id'>>;
  getPostInfoById?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<QueryGetPostInfoByIdArgs, 'post_id'>>;
  getPostTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType, RequireFields<QueryGetPostTagsArgs, 'query'>>;
  getPostsInWall?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostsInWallArgs, 'limit' | 'offset' | 'wall_id'>>;
  getRegisteredGuestsInEvent?: Resolver<Array<ResolversTypes['UserPublicInfo']>, ParentType, ContextType, RequireFields<QueryGetRegisteredGuestsInEventArgs, 'event_id'>>;
  getTrendingEventTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getTrendingListingTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getTrendingPostsTags?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  getUserInfoByWallId?: Resolver<ResolversTypes['UserPublicInfo'], ParentType, ContextType, RequireFields<QueryGetUserInfoByWallIdArgs, 'wall_id'>>;
  isCurrentUserASubscriber?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<QueryIsCurrentUserASubscriberArgs, 'wall_id'>>;
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
  tagline?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthUserEventState?: AuthUserEventStateResolvers<ContextType>;
  AuthUserPostState?: AuthUserPostStateResolvers<ContextType>;
  Event?: EventResolvers<ContextType>;
  EventJoiningInfo?: EventJoiningInfoResolvers<ContextType>;
  Listing?: ListingResolvers<ContextType>;
  ListingCustomer?: ListingCustomerResolvers<ContextType>;
  ListingProductItem?: ListingProductItemResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostComment?: PostCommentResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Review?: ReviewResolvers<ContextType>;
  UserInstance?: UserInstanceResolvers<ContextType>;
  UserPublicInfo?: UserPublicInfoResolvers<ContextType>;
};

