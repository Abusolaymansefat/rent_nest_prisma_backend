import { RentalStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateReview } from "./review.interface";


const createReview = async (
  tenantId: string,
  payload: ICreateReview
) => {
  const { propertyId, rentalRequestId, rating, comment } = payload;

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Property exists?
  const property = await prisma.property.findUnique({
    where: {
      id: propertyId,
    },
  });

  if (!property) {
    throw new Error("Property not found");
  }

  // Rental exists?
  const rental = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
  });

  if (!rental) {
    throw new Error("Rental request not found");
  }

  // Owner check
  if (rental.tenantId !== tenantId) {
    throw new Error("You are not allowed to review this rental");
  }

  // Property check
  if (rental.propertyId !== propertyId) {
    throw new Error("Invalid property");
  }

  // Rental completed?
  if (rental.status !== RentalStatus.COMPLETED) {
    throw new Error(
      "Review can only be submitted after rental completion"
    );
  }

  // Already reviewed?
  const alreadyReviewed = await prisma.review.findUnique({
    where: {
      rentalRequestId,
    },
  });

  if (alreadyReviewed) {
    throw new Error("Review already submitted");
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      tenantId,
      propertyId,
      rentalRequestId,
      rating,
      comment,
    },
    include: {
      tenant: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
      property: {
        select: {
          id: true,
          title: true,
          location: true,
        },
      },
    },
  });

  return review;
};

export const ReviewService = { createReview };