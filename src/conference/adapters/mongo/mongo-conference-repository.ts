import { Conference } from "../../entities/conference.entity"; 
import { IConferenceRepository } from "../../ports/conference-repository.interface"; 
import { MongoConference } from "./mongo-conference";

export class MongoConferenceRepository implements IConferenceRepository {
    async create(conference: Conference): Promise<void> {
        const conferenceDoc = new MongoConference.ConferenceModel({
            _id: conference.props.id, 
            organizerId: conference.props.organizerId,
            title: conference.props.title,
            startDate: conference.props.startDate,
            endDate: conference.props.endDate,
            seats: conference.props.seats,
        });
        await conferenceDoc.save(); 
    }
    
    async findById(conferenceId: string): Promise<Conference | null> {
        const foundConference = await MongoConference.ConferenceModel.findOne({ _id: conferenceId }).exec();
        if (!foundConference) return null;

        return new Conference({
            id: foundConference._id,
            organizerId: foundConference.organizerId,
            title: foundConference.title,
            startDate: foundConference.startDate,
            endDate: foundConference.endDate,
            seats: foundConference.seats,
        });
    }

    async update(conference: Conference): Promise<void> {
        await MongoConference.ConferenceModel.updateOne(
            { _id: conference.props.id }, 
            { $set: conference.props }
        ).exec();
    }

    async delete(conferenceId: string): Promise<void> {
        await MongoConference.ConferenceModel.deleteOne({ _id: conferenceId }).exec();
    }
}
