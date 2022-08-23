import { Entity, Schema } from "redis-om";
import { dbClient } from ".";

interface EventTagModel {
    label_aka_value: string,
}

class EventTagModel extends Entity { }

const eventTagModelSchema = new Schema(EventTagModel, {
    label_aka_value: {type: 'text', indexed: true},
},{
    dataStructure: 'JSON',
    indexedDefault: true,
});


export const eventTagModelRepository=dbClient.fetchRepository(eventTagModelSchema)

eventTagModelRepository.createIndex()
