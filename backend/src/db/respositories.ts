import {
  postCommentModelSchema,
  eventModelSchema,
  eventRegisteredMemberModelSchema,
  eventTagModelSchema,
  listingBuyModelSchema,
  listingModelSchema,
  listingProductItemModelSchema,
  ListingModelSchema,
  postLikeModelSchema,
  postModelSchema,
  postTagModelSchema,
  potentialUserModelSchema,
  userFollowerModelSchema,
  userModelSchema,
} from "@onesocial/shared";
import { dbClient } from "./index";

export const postCommentModelRepository = dbClient.fetchRepository(
  postCommentModelSchema
);

// postCommentModelRepository.createIndex();

export const eventModelRepository = dbClient.fetchRepository(eventModelSchema);

// eventModelRepository.createIndex();

export const eventRegisteredMemberModelRepository = dbClient.fetchRepository(
  eventRegisteredMemberModelSchema
);

// eventRegisteredMemberModelRepository.createIndex();

export const eventTagModelRepository =
  dbClient.fetchRepository(eventTagModelSchema);

// eventTagModelRepository.createIndex();

export const listingBuyModelRepository = dbClient.fetchRepository(
  listingBuyModelSchema
);

// listingBuyModelRepository.createIndex();

export const listingModelRepository =
  dbClient.fetchRepository(listingModelSchema);

// listingModelRepository.createIndex();

export const listingProductItemModelRepository = dbClient.fetchRepository(
  listingProductItemModelSchema
);

// listingProductItemModelRepository.createIndex();

export const listingTagModelRepository =
  dbClient.fetchRepository(ListingModelSchema);

// listingTagModelRepository.createIndex();

export const postLikeModelRepository =
  dbClient.fetchRepository(postLikeModelSchema);

// postLikeModelRepository.createIndex();

export const postModelRepository = dbClient.fetchRepository(postModelSchema);

// postModelRepository.createIndex();

export const postTagModelRepository =
  dbClient.fetchRepository(postTagModelSchema);

// postTagModelRepository.createIndex();

export const potentialUserModelRepository = dbClient.fetchRepository(
  potentialUserModelSchema
);

// potentialUserModelRepository.createIndex()

export const userFollowerModelRepository = dbClient.fetchRepository(
  userFollowerModelSchema
);

// userFollowerModelRepository.createIndex();

export const userModelRepository = dbClient.fetchRepository(userModelSchema);
