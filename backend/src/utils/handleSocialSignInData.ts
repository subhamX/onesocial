import { userModelRepository, potentialUserModelRepository } from '@onesocial/shared';
import { Response } from 'express'
import { uploadFileToPublicStorage } from '../routes/storage';
import { setAuthTokenAsCookie, setTmpAuthTokenAsCookie } from './setSignedTokenAsCookie';


export const handleSocialSignInData = async (
  res: Response,
  userData: {
    name: string;
    email: string;
    avatar_url: string;
    //   using_github_auth?: boolean;
    using_google_auth?: boolean;
    using_twitter_auth?: boolean;
    twitter_user_name?: string
  }
) => {
  const {
    email,
    name,
    avatar_url,
    using_google_auth,
    using_twitter_auth
  } = userData;

  // check if user already exists
  // if yes then login
  // if no then insert a tmp record, and ask the user to full in other details; 
  // and send a cookie

  const userInstance = await userModelRepository.search().where('email').equal(email).return.first()

  if (!userInstance) {
    const oldEntityIfExists = await potentialUserModelRepository.search().where('email').equal(email).return.first();

    
    // register the user
    if(oldEntityIfExists){
      await potentialUserModelRepository.remove(oldEntityIfExists.entityId)
    }

    const entity = potentialUserModelRepository.createEntity()
    const ourServerAvatarUrl = await uploadFileToPublicStorage(avatar_url)

    entity.avatar_url = ourServerAvatarUrl;
    entity.email = email
    entity.name=name;

    if (userData.twitter_user_name) entity.twitter_user_name = userData.twitter_user_name
    entity.is_google_account_connected = userData.using_google_auth ?? false

    await potentialUserModelRepository.save(entity);

    setTmpAuthTokenAsCookie(res, entity)
    res.redirect("/auth/persevere");
  } else {
    // send the auth cookie

    if (using_google_auth) userInstance.is_google_account_connected = true;
    if (userData.twitter_user_name) userInstance.twitter_user_name = userData.twitter_user_name

    userInstance.last_token_generated_at = new Date()

    await userModelRepository.save(userInstance)

    setAuthTokenAsCookie(res, userInstance);
    res.redirect("/dash");

  }
};
