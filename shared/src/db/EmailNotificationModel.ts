import { Entity, Schema } from "redis-om";


export type EmailNotificationEventType =
    'notification_event:new_user_signup_complete' 
  | 'notification_event:new_post' 
  | 'notification_event:new_comment' 
  | 'notification_event:new_listing' 
  | 'notification_event:new_like_on_post' 
  | 'notification_event:new_follow_to_user' 
  | 'notification_event:new_message_to_chat'
  | 'notification_event:new_product_item'



export type EmailNotificationEventTypeToPayloadType = {
  'notification_event:new_user_signup_complete': {
    templateName: 'welcome.html',
    userEmail: string
  },
  'notification_event:new_post': any 
  'notification_event:new_comment': any 
  'notification_event:new_listing': any 
  'notification_event:new_like_on_post': any 
  'notification_event:new_follow_to_user': any 
  'notification_event:new_message_to_chat': any
  'notification_event:new_product_item': any
}

export interface EmailNotificationModel {
  event_type: EmailNotificationEventType;
  json_payload: string,
  created_at: string;
}

export class EmailNotificationModel extends Entity { }

export const emailNotificationsModelSchema = new Schema(
  EmailNotificationModel,
  {
    event_type: { type: 'string' },
    json_payload: { type: "string" },
    created_at: { type: 'date' }
  },
  {
    dataStructure: "JSON",
    indexedDefault: true,
  }
);
