import { testUsers } from "../../user/tests/user-seeds";
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository";
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository";
import { Booking } from "../entities/booking.entity";
import { SeatsNotAvailableException } from "../exceptions/seats-not-available.exception";
import { testConference } from "../tests/conference-seeds";
import { ReserveSeat } from "./reserve-seat";

describe("Feature: Reserving a seat", () => {
  async function expectSeatsUnchanged() {
    const fetchedConference = await repository.findById(
      testConference.conference1.props.id
    );
    expect(fetchedConference?.props.seats).toEqual(50);
  }

  let repository: InMemoryConferenceRepository;
  let bookingRepository: InMemoryBookingRepository;
  let useCase: ReserveSeat;

  beforeEach(async () => {
    repository = new InMemoryConferenceRepository();
    bookingRepository = new InMemoryBookingRepository();
    useCase = new ReserveSeat(repository, bookingRepository);

    await repository.create(testConference.conference1);
  });

  describe("Scenario: Happy path", () => {
    it("should reserve a seat", async () => {
      await useCase.execute({
        user: testUsers.johnDoe,
        conferenceId: testConference.conference1.props.id,
      });

      const currentBookings = await bookingRepository.findByConferenceId(testConference.conference1.props.id);
      expect(currentBookings.length).toEqual(1);
    });
  });

  describe("Scenario: Conference does not exist", () => {
    it("should fail", async () => {
      await expect(
        useCase.execute({
          user: testUsers.johnDoe,
          conferenceId: "non-existing-id",
        })
      ).rejects.toThrow("Conference not found");

      await expectSeatsUnchanged();
    });
  });

  describe("Scenario: No seats available", () => {
    it("should fail when no seats are available", async () => {
      for (let i = 0; i < 50; i++) {
        await bookingRepository.create(new Booking({
          userId: testUsers.johnDoe.props.id,
          conferenceId: testConference.conference1.props.id,
        }));
      }

      await expect(
        useCase.execute({
          user: testUsers.johnDoe,
          conferenceId: testConference.conference1.props.id,
        })
      ).rejects.toThrow(SeatsNotAvailableException);

      await expectSeatsUnchanged();
    });
  });
});
