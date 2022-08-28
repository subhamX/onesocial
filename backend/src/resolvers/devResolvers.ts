import {
  Mutation,
  Event,
  PostComment,
  Listing,
  ListingCustomer,
  UserPublicInfo,
  UserModel,
  QueryGetRegisteredGuestsInEventArgs,
  QueryGetListingsBoughtArgs,
  ListingModel,
  QueryGetAllCustomersArgs,
  QueryGetListingBuyersArgs,
  QueryGetUserInfoByWallIdArgs,
  QueryIsCurrentUserASubscriberArgs,
  Query,
  QueryGetPostTagsArgs,
  QueryGetPostInfoByIdArgs,
  PostModel,
  QueryGetPostCommentsArgs,
  PostCommentModel,
  QueryGetPostsInWallArgs,
  QueryGetEventInfoByIdArgs,
  EventModel,
  QueryGetEventsInWallArgs,
  QueryGetListingInfoByIdArgs,
  QueryGetListingsInWallArgs,
  QueryFetchEventsArgs,
  QueryFetchPostsArgs,
  QueryFetchListingsArgs,
  QueryGetMyFollowersArgs,
  QueryGetMyFollowingsArgs,
  MutationSendEmailToEventGuestsArgs,
  MutationCreateOrEditPostArgs,
  MutationSubmitPostCommentArgs,
  MutationTogglePostLikeArgs,
  MutationCreateOrEditEventArgs,
  EventLocationType,
  MutationRegisterForEventArgs,
  MutationToggleFollowAUserArgs,
  MutationCreateOrEditListingArgs,
  ListingType,
  MutationEditListingProductItemsMetaDataArgs,
  ListingProductItemModel,
  MutationDeleteListingProductItemArgs,
  MutationPublishProductListingArgs,
  ListingProductItem,
  MutationSendMessageArgs,
  ChatModel,
  Message,
  QueryGetChatSessionDetailsArgs,
  ChatSessionMeta,
} from "@onesocial/shared";
import {
  userModelRepository,
  eventRegisteredMemberModelRepository,
  eventModelRepository,
  listingBuyModelRepository,
  listingModelRepository,
  userFollowerModelRepository,
  postTagModelRepository,
  postModelRepository,
  postLikeModelRepository,
  postCommentModelRepository,
  eventTagModelRepository,
  listingTagModelRepository,
  listingProductItemModelRepository,
  chatModelRepository,
} from "../db/respositories";
import { ApolloContext } from "../types/ApolloContext";
import * as yup from "yup";
import { redisPublishClient } from "../db";

type PostWithoutCommentsAndCreatorInfoType = Omit<
  Mutation["createOrEditPost"],
  "comments" | "creator_info"
>;
type PostCommentWithoutPostedByType = Omit<PostComment, "posted_by">;

type PostWithoutCommentsType = Omit<Mutation["createOrEditPost"], "comments">;

type EventWithoutOrganizerType = Omit<Event, "organizer">;

type ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType = Omit<
  Listing,
  "author" | "product_items" | "buy_instance_id"
>;
type ListingWithoutProductItemsAndBuyInstanceIdType = Omit<
  Listing,
  "product_items" | "buy_instance_id"
>;

type ChatSessionMetaWithListingWithoutAuthorAndProductItemsAndBuyInstanceIdType = Omit<ChatSessionMeta, 'listing'> & { listing: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType };

type ListingCustomerWithoutBuyer = Omit<ListingCustomer, "listing"> & {
  listing: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType;
};

const resolveUserPublicInfoFromId = async (
  userId: string
): Promise<UserPublicInfo> => {
  const user = await userModelRepository
    .search()
    .where("id")
    .equal(userId)
    .return.first();
  if (!user) throw new Error("Logic Error");

  const instance = user.toRedisJson() as UserModel;

  return {
    ...instance,
    user_id: user.id,
  };
};

export const devResolvers = {
  Query: {
    getAllChatSessions: async (
      _: any,
      __: any,
      { user }: ApolloContext
    ): Promise<ChatSessionMetaWithListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[]> => {
      if (!user) throw new Error("auth required");

      // get all listings where the current user is owner or buyer
      const listingBuyInstances = await listingBuyModelRepository.search()
        .where('buyer_id').equal(user.id)
        .or('owner_id').equal(user.id)
        .returnAll()

      const listings = await listingModelRepository.fetch(listingBuyInstances.map(i => i.listing_id))
      const listingsWithChatSupport = listings.filter(e => e.includes_chat_support === true)

      // let query=userModelRepo.search();

      // for(const listing of listingsWithChatSupport){
      //     query=query.or('id').equal(listing.author_id)
      // }

      // const users = await query.all()

      // e.author_id

      const response: ChatSessionMetaWithListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[] = []

      for (const listingBuyInstance of listingBuyInstances) {
        const listing = listingsWithChatSupport.find(e => e.entityId === listingBuyInstance.listing_id)
        if (!listing) continue; // means the listing didn't have chat support
        let buyerDetails=null;
        
        if(listingBuyInstance.buyer_id !== user.id){
          buyerDetails=await resolveUserPublicInfoFromId(listingBuyInstance.buyer_id)
        }
        response.push({
          listing: {
            ...(listing.toRedisJson() as ListingModel),
            id: listing.entityId,
          },
          bought_at: listingBuyInstance.bought_at,
          buy_instance_id: listingBuyInstance.entityId,
          session_as_buyer: listingBuyInstance.buyer_id === user.id,
          buyer_info: buyerDetails
        })
      }

      return response;
    },

    getChatSessionDetails: async (
      _: any,
      { buy_instance_id }: QueryGetChatSessionDetailsArgs,
      { user }: ApolloContext,
    ): Promise<Query['getChatSessionDetails']> => {
      if (!user) throw new Error("auth required");

      const instance = await listingBuyModelRepository.fetch(buy_instance_id);
      if (!instance.buyer_id) throw new Error("Invalid access or no such buy instance exists ");


      const messages = await chatModelRepository
        .search()
        .where("buy_instance_id")
        .equal(buy_instance_id)
        .sortAscending('sent_at')
        .return.all();

      const listingInstance = await listingModelRepository.fetch(instance.listing_id);

      return {
        bought_at: instance.bought_at,
        buyer_id: instance.buyer_id,
        currency: instance.currency,
        buy_instance_id: instance.entityId,
        listing_id: instance.listing_id,
        price: instance.price,
        message: messages.map((message) => ({
          ...message.toRedisJson() as ChatModel,
        })),
        owner_id: instance.owner_id,
        listingName: listingInstance.name
      }
    },
    getEventsRegistered: async (
      _: any,
      args: QueryGetRegisteredGuestsInEventArgs,
      context: ApolloContext
    ): Promise<EventWithoutOrganizerType[]> => {
      if (!context.user) throw new Error("auth required");

      const eventsMeta = await eventRegisteredMemberModelRepository
        .search()
        .where("member_wall_id")
        .equal(context.user.id)
        .return.all();
      console.log(eventsMeta);
      // now fetch the events
      const events = await eventModelRepository.fetch(
        eventsMeta.map((e) => e.event_id)
      );

      return events.map((e) => ({
        ...(e.toRedisJson() as EventModel),
        event_id: e.entityId,
      }));
    },

    getListingsBought: async (
      parent: any,
      args: QueryGetListingsBoughtArgs,
      context: ApolloContext
    ): Promise<ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[]> => {
      if (!context.user) throw new Error("Not Authorized");

      const listingBuyInstances = await listingBuyModelRepository
        .search()
        .where("buyer_id")
        .equal(context.user.id)
        .return.page(args.offset, args.limit);

      const listings = await listingModelRepository.fetch(
        listingBuyInstances.map((e) => e.listing_id)
      );

      return listings.map((e) => ({
        ...(e.toRedisJson() as ListingModel),
        id: e.entityId,
      }));
    },

    getAllCustomers: async (
      parent: any,
      args: QueryGetAllCustomersArgs,
      context: ApolloContext
    ): Promise<ListingCustomerWithoutBuyer[]> => {
      if (!context.user) throw new Error("Not Authorized");

      const listingBuyInstances = await listingBuyModelRepository
        .search()
        .where("owner_id")
        .equal(context.user.id)
        .return.page(args.offset, args.limit);

      const listings = await listingModelRepository.fetch(
        listingBuyInstances.map((e) => e.listing_id)
      );

      // here we cannot use fetch. we'll have to build it ourselves
      // const buyers = await userModelRepository.fetch(listingBuyInstances.map(e => e.buyer_id))

      let buyersQuery = userModelRepository.search();

      listingBuyInstances.forEach((e) => {
        buyersQuery = buyersQuery.or("id").equal(e.buyer_id);
      });

      const buyers = await buyersQuery.return.all();

      // we're getting this listing, and user only to avoid the N+1 problem
      return listingBuyInstances.map((e) => {
        const instance = listings.find(
          (listing) => listing.entityId === e.listing_id
        );
        if (!instance) throw new Error("Logic Error");

        const buyer = buyers.find((user) => user.id === e.buyer_id);
        if (!buyer) throw new Error("Logic Error in buyer");

        return {
          buy_instance_id: e.entityId,
          buyer_id: e.buyer_id,
          listing_id: e.listing_id,
          listing: {
            ...(instance.toRedisJson() as ListingModel),
            id: instance.entityId,
          },
          buyer: {
            ...(buyer.toRedisJson() as UserModel),
            user_id: buyer.id,
          },
        };
      });
    },

    getListingBuyers: async (
      parent: any,
      args: QueryGetListingBuyersArgs,
      context: ApolloContext
    ): Promise<UserPublicInfo[]> => {
      if (!context.user) throw new Error("Please login to access it");

      const listingBuyInstances = await listingModelRepository.fetch(
        args.listing_id
      );

      if (listingBuyInstances.author_id !== context.user.id)
        throw new Error("Not Authorized");

      const buyInstances = await listingBuyModelRepository
        .search()
        .where("listing_id")
        .equal(args.listing_id)
        .return.all();

      const buyers = await userModelRepository.fetch(
        buyInstances.map((e) => e.buyer_id)
      );
      return buyers.map((e) => ({
        ...(e.toRedisJson() as UserModel),
        user_id: e.id,
      }));
    },

    getUserInfoByWallId: async (
      parent: any,
      args: QueryGetUserInfoByWallIdArgs,
      context: ApolloContext
    ) => {
      const user = await userModelRepository
        .search()
        .where("id")
        .equal(args.wall_id)
        .return.first();
      if (!user) throw new Error(`Invalid user id: ${args.wall_id}`);

      const instance = user.toRedisJson() as UserModel;

      return {
        ...instance,
        user_id: user.id,
      };
    },

    isCurrentUserASubscriber: async (
      parent: any,
      args: QueryIsCurrentUserASubscriberArgs,
      context: ApolloContext
    ): Promise<Query["isCurrentUserASubscriber"]> => {
      if (!context.user) return false; // returning false as the user is not logged in

      const userFollowInstance = await userFollowerModelRepository
        .search()
        .where("creator_id")
        .equal(args.wall_id)
        .where("follower_id")
        .equal(context.user.id)
        .return.first();
      if (!userFollowInstance) return false; // returning false as the user is not subscribed to the wall
      return true;
    },

    getPostTags: async (
      _: any,
      params: QueryGetPostTagsArgs,
      ctx: ApolloContext
    ): Promise<Query["getPostTags"]> => {
      if (!ctx.user) throw new Error("auth required");

      const tags = await postTagModelRepository
        .search()
        .where("label_aka_value")
        .match(`${params.query}*`)
        .return.all();
      return tags.map((e) => e.label_aka_value) ?? [];
    },

    getPostInfoById: async (
      _: any,
      params: QueryGetPostInfoByIdArgs,
      ctx: ApolloContext
    ): Promise<PostWithoutCommentsAndCreatorInfoType> => {
      // No auth required
      const instance = await postModelRepository.fetch(params.post_id);
      if (!instance.creator_id)
        throw new Error(`Invalid post_id: ${params.post_id}`);
      const returnVal = instance.toRedisJson() as PostModel;

      return {
        ...returnVal,
        desc_mini: instance.desc_full_markdown.substring(0, 300),
        post_id: instance.entityId,
      };
    },

    authUserPostState: async (
      _: any,
      params: QueryGetPostInfoByIdArgs,
      { user }: ApolloContext
    ): Promise<Query["authUserPostState"]> => {
      if (!user) return null;

      // TODO: check if the post is liked by me
      const instance = await postLikeModelRepository
        .search()
        .where("user_id")
        .equal(user.id)
        .where("post_id")
        .equal(params.post_id)
        .return.first();

      return {
        is_post_liked_by_me: !!instance,
        post_id: params.post_id,
      };
    },

    getPostComments: async (
      _: any,
      params: QueryGetPostCommentsArgs,
      ctx: ApolloContext
    ): Promise<Omit<PostComment, "posted_by">[]> => {
      const response = await postCommentModelRepository
        .search()
        .where("post_id")
        .equal(params.post_id)
        .sortDesc("commented_at")
        .page(params.offset, params.limit);

      const res = response
        .map((e) => ({
          ...(e.toRedisJson() as PostCommentModel),
          comment_id: e.entityId,
        }))
        .reverse();

      return res;
    },

    getPostsInWall: async (
      _: any,
      params: QueryGetPostsInWallArgs,
      ctx: ApolloContext
    ): Promise<PostWithoutCommentsAndCreatorInfoType[]> => {
      // no auth required
      const response = await postModelRepository
        .search()
        .where("creator_id")
        .equal(params.wall_id)
        .sortDesc("published_on")
        .page(params.offset, params.limit);

      const res: PostWithoutCommentsAndCreatorInfoType[] = response.map(
        (e): PostWithoutCommentsAndCreatorInfoType => ({
          ...(e.toRedisJson() as PostModel),
          post_id: e.entityId,
          desc_mini: e.desc_full_markdown.substring(0, 300),
        })
      );

      return res;
    },

    getEventTags: async (
      _: any,
      params: QueryGetPostTagsArgs,
      ctx: ApolloContext
    ): Promise<Query["getEventTags"]> => {
      const tags = await eventTagModelRepository
        .search()
        .where("label_aka_value")
        .match(`${params.query}*`)
        .return.all();
      return tags.map((e) => e.label_aka_value) ?? [];
    },

    getListingTags: async (
      _: any,
      params: QueryGetPostTagsArgs,
      ctx: ApolloContext
    ): Promise<Query["getEventTags"]> => {
      const tags = await listingTagModelRepository
        .search()
        .where("label_aka_value")
        .match(`${params.query}*`)
        .return.all();
      return tags.map((e) => e.label_aka_value) ?? [];
    },

    getEventInfoById: async (
      _: any,
      params: QueryGetEventInfoByIdArgs,
      ctx: ApolloContext
    ): Promise<EventWithoutOrganizerType> => {
      // No auth required
      const instance = await eventModelRepository.fetch(params.event_id);
      if (!instance.organizer_id)
        throw new Error(`Invalid event_id: ${params.event_id}`);
      const returnVal = instance.toRedisJson() as EventModel;

      return {
        ...returnVal,
        event_id: instance.entityId,
      };
    },
    authUserEventState: async (
      _: any,
      params: QueryGetEventInfoByIdArgs,
      { user }: ApolloContext
    ): Promise<Query["authUserEventState"]> => {
      if (!user) return null;

      const eventInstance = await eventModelRepository.fetch(params.event_id);
      if (!eventInstance.organizer_id)
        throw new Error(`Invalid event_id: ${params.event_id}`);

      // check if the current user is organizer or registered for the event
      let is_registered = user.id === eventInstance.organizer_id;
      if (!is_registered) {
        const instance = await eventRegisteredMemberModelRepository
          .search()
          .where("member_wall_id")
          .equal(user.id)
          .and("event_id")
          .equal(params.event_id)
          .return.first();
        if (instance) is_registered = true;
      }

      const userFollowerInstance =
        eventInstance.organizer_id === user.id ||
        (await userFollowerModelRepository
          .search()
          .where("follower_id")
          .equal(user.id)
          .where("creator_id")
          .equal(eventInstance.organizer_id)
          .return.first());

      return {
        event_id: params.event_id,
        joining_info: is_registered
          ? {
            additional_info: eventInstance.additional_info,
            address: eventInstance.address,
            event_url: eventInstance.event_url,
          }
          : null,
        is_registered,
        is_user_a_follower: userFollowerInstance !== null,
      };
    },

    getEventsInWall: async (
      _: any,
      params: QueryGetEventsInWallArgs,
      ctx: ApolloContext
    ): Promise<EventWithoutOrganizerType[]> => {
      // no auth required
      const response = await eventModelRepository
        .search()
        .where("organizer_id")
        .equal(params.wall_id)
        .sortDesc("posted_on")
        .page(params.offset, params.limit);

      const res: EventWithoutOrganizerType[] = response.map(
        (e): EventWithoutOrganizerType => ({
          ...(e.toRedisJson() as EventModel),
          event_id: e.entityId,
        })
      );
      return res;
    },

    getListingInfoById: async (
      _: any,
      params: QueryGetListingInfoByIdArgs,
      ctx: ApolloContext
    ): Promise<ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType> => {
      // No auth required
      const instance = await listingModelRepository.fetch(params.listing_id);
      if (!instance.author_id)
        throw new Error(`Invalid listing_id: ${params.listing_id}`);
      const returnVal = instance.toRedisJson() as ListingModel;

      return {
        ...returnVal,
        id: instance.entityId,
      };
    },

    getListingsInWall: async (
      _: any,
      params: QueryGetListingsInWallArgs,
      ctx: ApolloContext
    ): Promise<ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[]> => {
      // no auth required
      const response = await listingModelRepository
        .search()
        .where("author_id")
        .equal(params.wall_id)
        .and("is_published")
        .equal(true)
        .sortDesc("published_at")
        .page(params.offset, params.limit);

      const res: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[] =
        response.map(
          (e): ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType => ({
            ...(e.toRedisJson() as ListingModel),
            id: e.entityId,
          })
        );
      return res;
    },

    // # we will match it with the tags, and title
    // # we want only show_in_discover as true
    // # for posts we shall sort by likes
    // # for events we shall sort by number_of_registrations
    // # for products and services we shall sort by review; (only those who bought can review)

    // ALL IS TRICKY....

    // Note: we're also getting the organizer, as we want to sort the results by that;
    fetchEvents: async (
      _: any,
      params: QueryFetchEventsArgs,
      ctx: ApolloContext
    ): Promise<EventWithoutOrganizerType[]> => {
      let query = eventModelRepository.search();
      if (params.payload.query) {
        query = query.where("title").matches(`${params.payload.query}*`);
      }

      params.payload.tags.forEach((tag) => {
        query = query.and("tags").contains(tag);
      });

      const today = new Date();
      today.setMinutes(0);
      today.setHours(0);
      today.setSeconds(0);

      const events = await query
        .and("show_in_discover")
        .equal(true)
        .and("event_start_time")
        .greaterThanOrEqualTo(today)
        .sortDesc("number_of_registrations")
        .sortDesc("posted_on")
        .page(params.payload.offset, params.payload.limit);

      return events.map(
        (e): EventWithoutOrganizerType => ({
          ...(e.toRedisJson() as EventModel),
          event_id: e.entityId,
        })
      );
    },

    fetchPosts: async (
      _: any,
      params: QueryFetchPostsArgs,
      ctx: ApolloContext
    ): Promise<PostWithoutCommentsAndCreatorInfoType[]> => {
      let query = postModelRepository.search();

      if (params.payload.query) {
        query = query.where("title").matches(`${params.payload.query}*`);
      }

      params.payload.tags.forEach((tag) => {
        query = query.and("tags").contains(tag);
      });

      const posts = await query
        .and("show_in_discover")
        .equal(true)
        .sortDesc("liked_by_count")
        .sortDesc("published_on")
        .page(params.payload.offset, params.payload.limit);

      return posts.map((post) => ({
        ...(post.toRedisJson() as PostModel),
        post_id: post.entityId,
        desc_mini: post.desc_full_markdown.substring(0, 300),
      }));
    },

    fetchListings: async (
      _: any,
      params: QueryFetchListingsArgs,
      ctx: ApolloContext
    ): Promise<ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType[]> => {
      let query = listingModelRepository.search();

      if (params.payload.query) {
        query = query.where("name").matches(`${params.payload.query}*`);
      }

      params.payload.tags.forEach((tag) => {
        query = query.and("tags").contains(tag);
      });

      const products = await query
        .where("is_published")
        .equal(true)
        .and("show_in_discover")
        .equal(true)
        .sortDesc("number_of_reviews")
        .sortDesc("published_at")
        .page(params.payload.offset, params.payload.limit);

      return products.map((product) => ({
        ...(product.toRedisJson() as ListingModel),
        id: product.entityId,
      }));
    },

    getTrendingEventTags: async (
      _: any,
      __: any,
      ctx: ApolloContext
    ): Promise<string[]> => {
      // TODO: Fix the trending logic;
      const tags = await eventTagModelRepository
        .search()
        .where("is_trending")
        .equal(true)
        .return.page(0, 10);
      return tags.map((tag) => tag.label_aka_value);
    },
    getTrendingPostsTags: async (
      _: any,
      __: any,
      ctx: ApolloContext
    ): Promise<string[]> => {
      // TODO: Fix the trending logic;
      const tags = await postTagModelRepository
        .search()
        .where("is_trending")
        .equal(true)
        .return.page(0, 10);
      return tags.map((tag) => tag.label_aka_value);
    },
    getTrendingListingTags: async (
      _: any,
      __: any,
      ctx: ApolloContext
    ): Promise<string[]> => {
      // TODO: Fix the trending logic;
      const tags = await listingTagModelRepository
        .search()
        .where("is_trending")
        .equal(true)
        .return.page(0, 10);
      return tags.map((tag) => tag.label_aka_value);
    },

    getMyFollowers: async (
      _: any,
      params: QueryGetMyFollowersArgs,
      { user }: ApolloContext
    ): Promise<UserPublicInfo[]> => {
      if (!user) throw new Error("auth required");
      const followers = await userFollowerModelRepository
        .search()
        .where("creator_id")
        .equals(user.id)
        .return.page(params.offset, params.limit);

      // const followersWithInfo = await userModelRepository
      //     .search()
      //     .where('id')
      //     .containsOneOf(...followers.map(follower => follower.follower_id)).return.all()

      const followersWithInfo: UserPublicInfo[] = [];

      // TODO: fix this very bad query
      for (const follower of followers) {
        const data = await resolveUserPublicInfoFromId(follower.follower_id);
        followersWithInfo.push(data);
      }

      return followersWithInfo;
    },
    getMyFollowings: async (
      _: any,
      params: QueryGetMyFollowingsArgs,
      { user }: ApolloContext
    ): Promise<UserPublicInfo[]> => {
      if (!user) throw new Error("auth required");
      const followings = await userFollowerModelRepository
        .search()
        .where("follower_id")
        .equals(user.id)
        .return.page(params.offset, params.limit);

      const followingsWithInfo: UserPublicInfo[] = [];

      // TODO: fix this very bad query
      for (const following of followings) {
        const data = await resolveUserPublicInfoFromId(following.creator_id);
        followingsWithInfo.push(data);
      }

      return followingsWithInfo;
    },

    getRegisteredGuestsInEvent: async (
      _: any,
      params: QueryGetRegisteredGuestsInEventArgs,
      { user }: ApolloContext
    ): Promise<UserPublicInfo[]> => {
      if (!user) throw new Error("auth required");

      // check that the event is actually owned by the user
      const event = await eventModelRepository.fetch(params.event_id);
      if (event.organizer_id !== user.id) throw new Error("unauthorized");

      // no pagination; :(
      const guests = await eventRegisteredMemberModelRepository
        .search()
        .where("event_id")
        .equals(params.event_id)
        .return.all();

      const response: UserPublicInfo[] = [];
      for (const guest of guests) {
        const data = await resolveUserPublicInfoFromId(guest.member_wall_id);
        response.push(data);
      }

      return response;
    },
  },
  Mutation: {
    sendEmailToEventGuests: async (
      _: any,
      params: MutationSendEmailToEventGuestsArgs,
      { user }: ApolloContext
    ): Promise<boolean> => {
      if (!user) throw new Error("auth required");

      const messageToSend = params.message.trim();
      if (!messageToSend) throw new Error("message is empty");

      const event = await eventModelRepository.fetch(params.event_id);
      if (event.organizer_id !== user.id) throw new Error("unauthorized");
      const guests = await eventRegisteredMemberModelRepository
        .search()
        .where("event_id")
        .equals(params.event_id)
        .return.all();
      let guestUserProfileQuery = userModelRepository.search();

      for (const guest of guests) {
        guestUserProfileQuery = guestUserProfileQuery
          .and("id")
          .equals(guest.member_wall_id);
      }

      // TODO: send the mail to these guests

      return true;
    },
    createOrEditPost: async (
      _: any,
      params: MutationCreateOrEditPostArgs,
      ctx: ApolloContext
    ): Promise<PostWithoutCommentsAndCreatorInfoType> => {
      if (!ctx.user) throw new Error("auth required");

      const shape = yup.object().shape({
        cover_image_url: yup.string().url().required(),
        desc_full_markdown: yup.string().required().min(10),
        post_id: yup.string(),
        show_in_discover: yup.bool().required(),
        title: yup.string().required().min(2).max(60),
        tags: yup.array().of(yup.string()).required(),
      });

      shape.validateSync(params.payload);

      // checking that all tags are correct!
      if (params.payload.tags.length) {
        const tagsSearch = await postTagModelRepository
          .searchRaw(`@label_aka_value:(${params.payload.tags.join("|")})`)
          .return.all();
        if (tagsSearch.length !== params.payload.tags.length) {
          throw new Error("Invalid tags");
        }
        if (params.payload.tags.length > 5)
          throw new Error("Too many tags. You can only have at max 5 tags");
      }

      let post = postModelRepository.createEntity();
      if (params.payload.post_id) {
        post = await postModelRepository.fetch(params.payload.post_id);
        if (post.creator_id !== ctx.user?.id)
          throw new Error("Invalid Id or permissions");
      }

      post.approx_read_time_in_minutes = 5; // TODO: fix it
      post.creator_id = ctx.user.id;
      post.title = params.payload.title;
      post.desc_full_markdown = params.payload.desc_full_markdown;
      post.cover_image_url = params.payload.cover_image_url;

      post.liked_by_count = post.liked_by_count ?? 0;
      post.published_on = new Date().toString();
      post.number_of_comments = post.number_of_comments ?? 0;
      post.show_in_discover = params.payload.show_in_discover;
      post.tags = params.payload.tags;

      await postModelRepository.save(post);
      const instance: PostModel = post.toRedisJson() as any;
      const data = {
        ...instance,
        desc_mini: post.desc_full_markdown.substring(0, 300),
        post_id: post.entityId,
      };

      return data;
    },
    submitPostComment: async (
      _: any,
      params: MutationSubmitPostCommentArgs,
      ctx: ApolloContext
    ): Promise<Omit<PostComment, "posted_by">> => {
      // auth required
      if (!ctx.user) throw new Error("auth required");

      const schema = yup.object().shape({
        comment: yup.string().required(),
        post_id: yup.string().required(),
      });

      schema.validateSync(params.payload);

      // check that post is valid
      const postInstance = await postModelRepository.fetch(
        params.payload.post_id
      );
      if (!postInstance.creator_id)
        throw new Error(`Invalid postId: ${params.payload.post_id}`);

      postInstance.number_of_comments++;
      postModelRepository.save(postInstance);

      const instance = postCommentModelRepository.createEntity();
      instance.comment = params.payload.comment;
      instance.posted_by_user_id = ctx.user.id;
      instance.post_id = params.payload.post_id;
      instance.commented_at = new Date().toISOString();

      await postCommentModelRepository.save(instance);

      return {
        ...(instance.toRedisJson() as PostCommentModel),
        comment_id: instance.entityId,
      };
    },
    togglePostLike: async (
      _: any,
      params: MutationTogglePostLikeArgs,
      { user }: ApolloContext
    ) => {
      if (!user) throw new Error("auth required");

      const instance = await postLikeModelRepository
        .search()
        .where("user_id")
        .equal(user.id)
        .where("post_id")
        .equal(params.post_id)
        .return.first();

      const post = await postModelRepository.fetch(params.post_id);
      if (!post.creator_id) throw new Error("invalid post id");

      if (instance) {
        // remove instance
        post.liked_by_count--;
        await postModelRepository.save(post);

        await postLikeModelRepository.remove(instance.entityId);
        return false; // now we're not liking the post
      } else {
        post.liked_by_count++;
        await postModelRepository.save(post);

        // we should've checked for validity of post_id; but who cares?
        await postLikeModelRepository.createAndSave({
          user_id: user.id,
          liked_at: new Date(),
          post_id: params.post_id,
        });
        return true;
      }
    },
    createOrEditEvent: async (
      _: any,
      params: MutationCreateOrEditEventArgs,
      { user }: ApolloContext
    ): Promise<EventWithoutOrganizerType> => {
      if (!user) throw new Error("auth required");

      const schema = yup.object().shape({
        show_in_discover: yup.bool().required(),
        is_member_only_event: yup.bool().required(),
        event_id: yup.string(),
        title: yup.string().required().min(2).max(60),
        event_start_time: yup.date().required(),
        duration_in_minutes: yup.number().required().min(1),
        cover_image_url: yup.string().url().required(),
        location_type: yup
          .string()
          .required()
          .oneOf([EventLocationType.InPerson, EventLocationType.Virtual]),
        desc_full_markdown: yup.string().required().min(10),
        tags: yup.array().of(yup.string()).required(),
        additional_info: yup.string(),
        event_url: yup.string().url(),
        address: yup.string(),
      });
      schema.validateSync(params.payload);

      if (
        params.payload.location_type === EventLocationType.InPerson &&
        !params.payload.address
      ) {
        throw new Error("address is required for in person events");
      } else if (
        params.payload.location_type === EventLocationType.Virtual &&
        !params.payload.event_url
      ) {
        throw new Error("virtual url is required for virtual events");
      }

      // checking that all tags are correct!
      if (params.payload.tags.length) {
        const tagsSearch = await eventTagModelRepository
          .searchRaw(`@label_aka_value:(${params.payload.tags.join("|")})`)
          .return.all();
        if (tagsSearch.length !== params.payload.tags.length) {
          throw new Error("Invalid tags");
        }
        if (params.payload.tags.length > 5)
          throw new Error("Too many tags. You can only have at max 5 tags");
      }

      if (
        params.payload.is_member_only_event &&
        params.payload.show_in_discover
      ) {
        throw new Error("Member only events cannot be shown in discover");
      }

      let event = eventModelRepository.createEntity();
      if (params.payload.event_id) {
        event = await eventModelRepository.fetch(params.payload.event_id);
        if (event.organizer_id !== user.id)
          throw new Error("Invalid Id or permissions");
      }

      event.show_in_discover = params.payload.show_in_discover;
      event.is_member_only_event = params.payload.is_member_only_event;
      event.title = params.payload.title;
      event.event_start_time = params.payload.event_start_time;
      event.duration_in_minutes = params.payload.duration_in_minutes;
      event.cover_image_url = params.payload.cover_image_url;
      event.location_type = params.payload.location_type;
      event.desc_full_markdown = params.payload.desc_full_markdown;
      event.number_of_registrations = event.number_of_registrations ?? 0;
      event.tags = params.payload.tags;
      event.organizer_id = user.id;
      event.additional_info = params.payload.additional_info;
      event.address = params.payload.address ?? null;
      event.event_url = params.payload.event_url ?? null;

      event.posted_on = event.posted_on ?? new Date().toString();

      await eventModelRepository.save(event);

      const instance: EventModel = event.toRedisJson() as any;

      return {
        ...instance,
        event_id: event.entityId,
      };
    },
    registerForEvent: async (
      _: any,
      params: MutationRegisterForEventArgs,
      { user }: ApolloContext
    ): Promise<Mutation["registerForEvent"]> => {
      if (!user) throw new Error("auth required");

      // checking that the eventId is valid
      const eventInstance = await eventModelRepository.fetch(params.event_id);
      if (!eventInstance.organizer_id)
        throw new Error(`Invalid event_id: ${params.event_id}`);

      if (user.id === eventInstance.organizer_id)
        throw new Error("You are organizer of this event");

      const instance = await eventRegisteredMemberModelRepository
        .search()
        .where("member_wall_id")
        .equal(user.id)
        .where("event_id")
        .equal(params.event_id)
        .return.first();
      if (instance)
        throw new Error("You are already registered for this event");

      // check if it's a member only event
      if (eventInstance.is_member_only_event) {
        const memberInstance = await userFollowerModelRepository
          .search()
          .where("follower_id")
          .equal(user.id)
          .return.first();
        if (!memberInstance)
          throw new Error(
            "This is a member only event. Please become a member to join the event."
          );
      }

      await eventRegisteredMemberModelRepository.createAndSave({
        member_wall_id: user.id,
        event_id: params.event_id,
        registered_at: new Date().toISOString(),
      });

      eventInstance.number_of_registrations++; // incrementing number of registrations
      await eventModelRepository.save(eventInstance);

      return true;
    },
    toggleFollowAUser: async (
      _: any,
      params: MutationToggleFollowAUserArgs,
      { user }: ApolloContext
    ): Promise<Mutation["toggleFollowAUser"]> => {
      if (!user) throw new Error("auth required");

      if (user.id === params.wall_id)
        throw new Error("You cannot follow yourself");

      const userInstance = await userModelRepository.fetch(params.wall_id);
      if (!userInstance.id) throw new Error("Invalid user_id");

      const instance = await userFollowerModelRepository
        .search()
        .where("follower_id")
        .equal(user.id)
        .where("creator_id")
        .equal(params.wall_id)
        .return.first();
      if (!instance) {
        // crete new instance
        await userFollowerModelRepository.createAndSave({
          follower_id: user.id,
          creator_id: params.wall_id,
          created_at: new Date().toISOString(),
        });
        return true;
      } else {
        // delete instance
        await userFollowerModelRepository.remove(instance.entityId);
        return false;
      }
    },

    createOrEditListing: async (
      _: any,
      params: MutationCreateOrEditListingArgs,
      { user }: ApolloContext
    ): Promise<ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType> => {
      if (!user) throw new Error("auth required");

      const schema = yup.object().shape({
        // currency,
        desc_full_markdown: yup.string().required().min(10),
        // includes_chat_support: false,
        // includes_video_call_support: false,
        // listing_type: ListingType.Service,
        name: yup.string().required().min(1).max(30),
        price: yup.number().required().min(0),
        // show_in_discover: true,
        cover_image_url: yup.string().url().required(),
        tags: yup.array().of(yup.string()).required(),
      });

      schema.validateSync(params.payload);

      // check that if it's a digital service, then atleast one of chat or video support is true
      if (
        params.payload.listing_type === ListingType.Service &&
        !params.payload.includes_chat_support &&
        !params.payload.includes_video_call_support
      ) {
        throw new Error(
          "Atleast one of chat or video support must be true for a *service* offering"
        );
      }

      if (
        params.payload.listing_type === ListingType.DigitalProduct &&
        (params.payload.includes_chat_support ||
          params.payload.includes_video_call_support)
      ) {
        throw new Error(
          "Chat and video support cannot be true for a *digital product* offering"
        );
      }

      if (
        !params.payload.includes_chat_support &&
        params.payload.includes_video_call_support
      ) {
        throw new Error(
          "Currently, chat support must be true if video call support is true for scheduling. We will have scheduling feature with google calendar integration soon. 🙂"
        );
      }

      // validate tags
      if (params.payload.tags.length) {
        const tagsSearch = await listingTagModelRepository
          .searchRaw(`@label_aka_value:(${params.payload.tags.join("|")})`)
          .return.all();
        if (tagsSearch.length !== params.payload.tags.length) {
          throw new Error("Invalid tags");
        }
        if (params.payload.tags.length > 5)
          throw new Error("Too many tags. You can only have at max 5 tags");
      }

      let listingInstance = listingModelRepository.createEntity();

      if (params.payload.id) {
        listingInstance = await listingModelRepository.fetch(params.payload.id);
      }

      listingInstance.name = params.payload.name;
      listingInstance.price = params.payload.price;
      listingInstance.currency = params.payload.currency;
      listingInstance.desc_full_markdown = params.payload.desc_full_markdown;
      listingInstance.includes_chat_support =
        params.payload.includes_chat_support;
      listingInstance.includes_video_call_support =
        params.payload.includes_video_call_support;
      if (
        params.payload.id &&
        listingInstance.listing_type !== params.payload.listing_type
      ) {
        throw new Error(
          "Sorry, you cannot change the listing type of an existing listing"
        );
      }
      listingInstance.listing_type = params.payload.listing_type;
      listingInstance.show_in_discover = params.payload.show_in_discover;
      listingInstance.cover_image_url = params.payload.cover_image_url;
      listingInstance.tags = params.payload.tags;
      listingInstance.author_id = user.id;
      listingInstance.video_duration = params.payload.video_duration;
      listingInstance.reviews_score = listingInstance.reviews_score ?? 0;
      listingInstance.number_of_reviews =
        listingInstance.number_of_reviews ?? 0;
      listingInstance.number_of_product_items =
        listingInstance.number_of_product_items ?? 0;

      listingInstance.created_at = new Date().toISOString();

      if (!params.payload.id) {
        // we will do this is_published thing saga only for new listings
        if (params.payload.listing_type === ListingType.Service) {
          // it it's service then publish it right away
          listingInstance.published_at = listingInstance.created_at;
          listingInstance.is_published = true;
        } else {
          listingInstance.is_published = false;
        }
      }

      await listingModelRepository.save(listingInstance);

      console.log(listingInstance.toRedisJson());
      return {
        ...(listingInstance.toRedisJson() as ListingModel),
        id: listingInstance.entityId,
      };
    },

    editListingProductItemsMetaData: async (
      _: any,
      params: MutationEditListingProductItemsMetaDataArgs,
      { user }: ApolloContext
    ): Promise<Mutation["editListingProductItemsMetaData"]> => {
      if (!user) throw new Error("auth required");

      // fetch the listing
      const listingInstance = await listingModelRepository.fetch(
        params.payload.listing_id
      );
      if (!listingInstance.listing_type) throw new Error("Invalid listing_id");

      if (listingInstance.author_id !== user.id)
        throw new Error("You are not the author of this listing");

      const response: Mutation["editListingProductItemsMetaData"] = [];
      // fetch the product item
      for (let i = 0; i < params.payload.items.length; i++) {
        const productItemInstance =
          await listingProductItemModelRepository.fetch(
            params.payload.items[i].id
          );
        if (!productItemInstance.owner_id) throw new Error("Invalid product_item_id");

        productItemInstance.description = params.payload.items[i].description;
        productItemInstance.name = params.payload.items[i].file_name;

        await listingProductItemModelRepository.save(productItemInstance);

        response.push({
          ...(productItemInstance.toRedisJson() as ListingProductItemModel),
          file_name: productItemInstance.name,
          id: productItemInstance.entityId,
        });
      }

      return response;
    },

    deleteListingProductItem: async (
      _: any,
      params: MutationDeleteListingProductItemArgs,
      { user }: ApolloContext
    ): Promise<Mutation["deleteListingProductItem"]> => {
      if (!user) throw new Error("auth required");

      const listingProductInstance =
        await listingProductItemModelRepository.fetch(
          params.listing_product_id
        );
      if (!listingProductInstance.listing_id) throw new Error("Invalid product id");

      if (listingProductInstance.owner_id !== user.id)
        throw new Error("You are not the owner of this product");

      const listingInstance = await listingModelRepository.fetch(
        listingProductInstance.listing_id
      );
      if (listingInstance.number_of_product_items === 1)
        throw new Error("You need to have at least one product item");

      listingInstance.number_of_product_items--;
      await listingModelRepository.save(listingInstance);

      await listingProductItemModelRepository.remove(params.listing_product_id);

      return true;
    },

    publishProductListing: async (
      _: any,
      params: MutationPublishProductListingArgs,
      { user }: ApolloContext
    ): Promise<Mutation["publishProductListing"]> => {
      if (!user) throw new Error("auth required");

      const listingInstance = await listingModelRepository.fetch(
        params.listing_id
      );
      if (!listingInstance.listing_type) throw new Error("Invalid listing id");

      if (listingInstance.author_id !== user.id)
        throw new Error("You are not the author of this listing");
      if (listingInstance.is_published)
        throw new Error("This listing is already published");

      listingInstance.published_at = new Date().toISOString();
      listingInstance.is_published = true;
      await listingModelRepository.save(listingInstance);

      return true;
    },

    sendMessage: async (_: any, params: MutationSendMessageArgs, { user }: ApolloContext): Promise<Mutation["sendMessage"]> => {
      if (!user) throw new Error("auth required");

      const listingBuyInstance = await listingBuyModelRepository.fetch(params.buy_instance_id);
      if (!listingBuyInstance.buyer_id) throw new Error("Invalid buy instance id");

      const messageInstance = chatModelRepository.createEntity();

      messageInstance.buy_instance_id = params.buy_instance_id;
      messageInstance.sent_by = user.id;
      messageInstance.message = params.message;
      messageInstance.sent_at = new Date().toISOString();
      messageInstance.seen_by = [user.id];
      const userInstance = await userModelRepository.search().where('id').equal(user.id).return.first();
      if (!userInstance) throw new Error('logic error');
      messageInstance.sent_by_user_avatar = userInstance.avatar_url;
      messageInstance.sent_by_user_name = user.name;

      // TODO: send event
      redisPublishClient.publish(`NEW_MESSAGE`, JSON.stringify({ fetchNewMessageOfSession: messageInstance.toRedisJson() }));

      await chatModelRepository.save(messageInstance);
      return true;
    }
  },
  Post: {
    comments: async (
      parent: PostWithoutCommentsAndCreatorInfoType,
      _: any,
      ctx: ApolloContext
    ): Promise<PostCommentWithoutPostedByType[]> => {
      // fetch comments
      const comments = await postCommentModelRepository
        .search()
        .where("post_id")
        .equal(parent.post_id)
        .sortDesc("commented_at")
        .page(0, 3);
      return comments
        .map((e) => ({
          ...(e.toRedisJson() as PostCommentModel),
          comment_id: e.entityId,
        }))
        .reverse();
    },
    creator_info: async (
      parent: PostWithoutCommentsAndCreatorInfoType,
      _: any,
      ctx: ApolloContext
    ): Promise<UserPublicInfo> =>
      resolveUserPublicInfoFromId(parent.creator_id),
  },
  PostComment: {
    posted_by: async (
      parent: Omit<PostComment, "posted_by">,
      _: any,
      ctx: ApolloContext
    ): Promise<UserPublicInfo> =>
      resolveUserPublicInfoFromId(parent.posted_by_user_id),
  },

  Event: {
    organizer: async (
      parent: EventWithoutOrganizerType,
      _: any,
      ctx: ApolloContext
    ): Promise<UserPublicInfo> =>
      resolveUserPublicInfoFromId(parent.organizer_id),
  },
  Listing: {
    author: async (
      parent: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType,
      _: any,
      ctx: ApolloContext
    ): Promise<UserPublicInfo> => resolveUserPublicInfoFromId(parent.author_id),
    product_items: async (
      parent: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType,
      _: any,
      ctx: ApolloContext
    ): Promise<ListingProductItem[]> => {
      if (parent.listing_type === ListingType.Service) {
        return [];
      }

      const productItems = await listingProductItemModelRepository
        .search()
        .where("listing_id")
        .equal(parent.id)
        .return.all();
      return productItems.map((e) => ({
        ...(e.toRedisJson() as ListingProductItemModel),
        id: e.entityId,
        file_name: e.name,
      }));
    },
    buy_instance_id: async (
      parent: ListingWithoutAuthorAndProductItemsAndBuyInstanceIdType,
      _: any,
      ctx: ApolloContext
    ): Promise<string> => {
      const user = ctx.user;
      if (!user) return "";

      if (parent.author_id === user.id) return "admin";

      const instance = await listingBuyModelRepository
        .search()
        .where("listing_id")
        .equal(parent.id)
        .and("buyer_id")
        .equal(user.id)
        .return.first();
      return instance?.entityId || "";
    },
  },
};
