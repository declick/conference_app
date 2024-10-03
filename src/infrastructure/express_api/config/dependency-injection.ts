import { asClass, asValue, createContainer } from "awilix";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
import { IConferenceRepository } from "../../../conference/ports/conference-repository.interface";
import { ChangeSeats } from "../../../conference/usecases/change-seats";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { CurrentDateGenerator } from "../../../core/adapters/current-date-generator";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { IDateGenerator } from "../../../core/ports/date-generator.interface";
import { IIDGenerator } from "../../../core/ports/id-generator.interface";
import { MongoUser } from "../../../user/adapters/mongo/mongo-user";
import { MongoUserRepository } from "../../../user/adapters/mongo/mongo-user-repository";
import { IUserRepository } from "../../../user/ports/user-repository.interface";
import { BasicAuthenticator } from "../../../user/services/basic-authenticator";


const container = createContainer()

container.register({
    conferenceRepository: asClass(InMemoryConferenceRepository).singleton(),
    idGenerator: asClass(RandomIDGenerator).singleton(),
    dateGenerator: asClass(CurrentDateGenerator).singleton(),
    userRepository: asValue(new MongoUserRepository(MongoUser.UserModel))
})

const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository
const idGenerator = container.resolve('idGenerator') as IIDGenerator
const dateGenerator = container.resolve('dateGenerator') as IDateGenerator
const userRepository = container.resolve('userRepository') as IUserRepository

container.register({
    organizeConference: asValue(new OrganizeConference(
        conferenceRepository, idGenerator, dateGenerator
    )),
    changeSeats: asValue(new ChangeSeats(
        conferenceRepository
    )),
    authenticator: asValue(new BasicAuthenticator(userRepository)),
})

export default container
