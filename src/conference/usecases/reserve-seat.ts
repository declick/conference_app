import { Executable } from "../../core/executable.interface";
import { User } from "../../user/entities/user.entity";
import { ConferenceNotFoundException } from "../exceptions/conference-not-found";
import { SeatsNotAvailableException } from "../exceptions/seats-not-available.exception";
import { IBookingRepository } from "../ports/booking-repository.interface";
import { IConferenceRepository } from "../ports/conference-repository.interface";
import { Booking } from "../entities/booking.entity";

type RequestReserveSeat = {
  user: User;
  conferenceId: string;
};

type ResponseReserveSeat = void;

export class ReserveSeat implements Executable<RequestReserveSeat, ResponseReserveSeat> {
  constructor(
    private readonly conferenceRepository: IConferenceRepository,
    private readonly bookingRepository: IBookingRepository
  ) {}

  async execute({ user, conferenceId }: RequestReserveSeat): Promise<void> {
    const conference = await this.conferenceRepository.findById(conferenceId);
    if (!conference) throw new ConferenceNotFoundException();

    const currentBookings = await this.bookingRepository.findByConferenceId(conferenceId);
    const bookedSeats = currentBookings.length;

    // Vérifier si des sièges sont disponibles
    if (conference.props.seats <= bookedSeats) {
      throw new SeatsNotAvailableException();
    }

    // Créer une réservation
    const booking = new Booking({
      userId: user.props.id,
      conferenceId: conferenceId,
    });
    await this.bookingRepository.create(booking);
  }
}
