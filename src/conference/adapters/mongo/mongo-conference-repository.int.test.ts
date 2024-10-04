import { Model } from "mongoose";
import { TestApp } from "../../../tests/utils/test-app"; 
import { MongoConference } from "./mongo-conference"; 
import { MongoConferenceRepository } from "./mongo-conference-repository";
import { testConference } from "../../tests/conference-seeds";
import { Conference } from "../../entities/conference.entity";
import { addDays, addHours } from "date-fns";

describe("MongoConferenceRepository", () => {
    let app: TestApp;
    let model: Model<MongoConference.ConferenceDocument>;
    let repository: MongoConferenceRepository;

    beforeEach(async () => {
        app = new TestApp();
        await app.setup();

        model = MongoConference.ConferenceModel; 
        await model.deleteMany({});
        repository = new MongoConferenceRepository(); 

        const record = new model({
            _id: testConference.conference1.props.id,
            organizerId: testConference.conference1.props.organizerId,
            title: testConference.conference1.props.title,
            startDate: testConference.conference1.props.startDate,
            endDate: testConference.conference1.props.endDate,
            seats: testConference.conference1.props.seats,
        });

        await record.save(); 
    });

    afterEach(async () => {
        await app.tearDown(); 
    });

    describe("Scenario: Create a conference", () => {
        it("should create a conference", async () => {
            const newConference = new Conference({
                id: `id-2-${Date.now()}`, 
                organizerId: testConference.conference1.props.organizerId, 
                title: "My second conference",
                seats: 100, 
                startDate: addDays(new Date(), 5), 
                endDate: addDays(addHours(new Date(), 3), 5) 
            });
    
            await repository.create(newConference); 
    
            const fetchedConference = await model.findOne({ _id: newConference.props.id });
    
            expect(fetchedConference?.toObject()).toEqual({
                _id: newConference.props.id,
                organizerId: newConference.props.organizerId,
                title: newConference.props.title,
                startDate: newConference.props.startDate,
                endDate: newConference.props.endDate,
                seats: newConference.props.seats,
                __v: 0, 
            });
        });

        describe("Scenario: Find by ID", () => {
            it("should find the conference corresponding to the ID", async () => {
                const conference = await repository.findById(testConference.conference1.props.id);
                expect(conference?.props).toEqual(testConference.conference1.props);
            });
    
            it("should return null if no conference found", async () => {
                const conference = await repository.findById("non-existing-id");
                expect(conference).toBeNull();
            });
        });
    
        describe("Scenario: Update a conference", () => {
            it("should update the conference", async () => {
                const updatedConference = new Conference({
                    id: testConference.conference1.props.id,
                    organizerId: testConference.conference1.props.organizerId,
                    title: "Updated Conference Title",
                    seats: 75,
                    startDate: testConference.conference1.props.startDate,
                    endDate: testConference.conference1.props.endDate,
                });
    
                await repository.update(updatedConference); 
    
                const fetchedConference = await model.findOne({ _id: testConference.conference1.props.id });
                expect(fetchedConference?.toObject().title).toEqual("Updated Conference Title");
                expect(fetchedConference?.toObject().seats).toEqual(75); 
            });
        });
    }); 
    });


