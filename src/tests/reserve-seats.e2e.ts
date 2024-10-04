
import request from "supertest";
import { MongoUserRepository } from "../user/adapters/mongo/mongo-user-repository";
import { MongoConferenceRepository } from "../conference/adapters/mongo/mongo-conference-repository";
import container from "../infrastructure/express_api/config/dependency-injection";
import { testConference } from "../conference/tests/conference-seeds";
import { testUsers } from "../user/tests/user-seeds";
import app from "../infrastructure/express_api/app";
import { IBookingRepository } from "../conference/ports/booking-repository.interface";

describe("Reserve Seat E2E", () => {
  let userRepository: MongoUserRepository;
  let conferenceRepository: MongoConferenceRepository;
  let bookingRepository: IBookingRepository;

  beforeAll(async () => {
    userRepository = container.resolve("userRepository");
    conferenceRepository = container.resolve("conferenceRepository");
    bookingRepository = container.resolve("bookingRepository");

    await userRepository.create(testUsers.johnDoe);
    await conferenceRepository.create(testConference.conference1);
  });

  it("should reserve a seat successfully", async () => {
    const response = await request(app)
      .post(`/conferences/${testConference.conference1.props.id}/reserve`)
      .set("Authorization", `Bearer some-valid-token`)
      .send({ userId: testUsers.johnDoe.props.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Seat reserved successfully");
  });

  it("should return an error when no seats are available", async () => {
    for (let i = 0; i < 50; i++) {
      await request(app)
        .post(`/conferences/${testConference.conference1.props.id}/reserve`)
        .set("Authorization", `Bearer some-valid-token`)
        .send({ userId: testUsers.johnDoe.props.id });
    }

    const response = await request(app)
      .post(`/conferences/${testConference.conference1.props.id}/reserve`)
      .set("Authorization", `Bearer some-valid-token`)
      .send({ userId: testUsers.johnDoe.props.id });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error", "No seats available");
  });
});
