import { AwilixContainer } from "awilix";
import { NextFunction, Request, Response } from "express";
import { ChangeSeats } from "../../../conference/usecases/change-seats";
import { User } from "../../../user/entities/user.entity";
import {
  ChangeDatesInputs,
  ChangeSeatsInputs,
  CreateConferenceInputs,
} from "../dto/conference.dto";
import { ValidatorRequest } from "../utils/validate-request";
import { ChangeDates } from "../../../conference/usecases/change-dates";


export const organizeConference = (container: AwilixContainer) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body;

      const { errors, input } = await ValidatorRequest(
        CreateConferenceInputs,
        body
      );

      if (errors) {
        return res.jsonError(errors, 400);
      }

      const result = await container.resolve("organizeConference").execute({
        user: req.user as User,
        title: input.title,
        startDate:new Date (input.startDate),
        endDate: new Date(input.endDate),
        seats: input.seats,
      });

      return res.jsonSuccess({ id: result.id }, 201);
    } catch (error) {
      next(error);
    }
  };
};


export const changeSeats = (container: AwilixContainer) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body = req.body;

      const { input, errors } = await ValidatorRequest(ChangeSeatsInputs, body);

      if (errors) {
        return res.jsonError(errors, 400);
      }

      await (container.resolve("changeSeats") as ChangeSeats).execute({
        user: req.user,
        conferenceId: id,
        seats: input.seats,
      });

      return res.jsonSuccess(
        { message: "The number of seats was changed correctly" },
        200
      );
    } catch (error) {
      next(error);
    }
  };
};


export const changeDates = (container: AwilixContainer) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const { input, errors } = await ValidatorRequest(
        ChangeDatesInputs,
        req.body
      );

      if (errors) {
        return res.jsonError(errors, 400);
      }

      const result = await (
        container.resolve("changeDates") as ChangeDates
      ).execute({
        user: req.user as User,
        conferenceId: id,
        startDate:new Date (input.startDate),
        endDate: new Date(input.endDate),
      });
      return res.jsonSuccess(result, 200);
    } catch (error) {
      next(error);
    }
  };
};
