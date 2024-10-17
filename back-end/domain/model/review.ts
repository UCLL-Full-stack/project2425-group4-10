import { Booking } from './booking';

export class Review {
    private id?: number; 
    private comment: string;
    private rating: number;
    private booking: Booking; // A review is tied to a booking

    constructor(review: { id?: number; comment: string; rating: number; booking: Booking }) {
        this.id = review.id;
        this.comment = review.comment;
        this.rating = review.rating;
        this.booking = review.booking;

        // Validate upon instantiation
        const validationResult = this.validate();
        if (!validationResult.isValid) {
            throw new Error(`Validation failed: ${validationResult.errors?.join(', ')}`);
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getComment(): string {
        return this.comment;
    }

    getRating(): number {
        return this.rating;
    }

    getBooking(): Booking {
        return this.booking;
    }

    validate(): { isValid: boolean; errors?: string[] } {
        const errors = [];

        if (!this.comment || this.comment.trim().length === 0) {
            errors.push('Comment is required.');
        }

        if (this.rating < 1 || this.rating > 5) {
            errors.push('Rating must be between 1 and 5.');
        }

        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }

    equals(review: Review): boolean {
        return (
            this.id === review.getId() &&
            this.comment === review.getComment() &&
            this.rating === review.getRating() &&
            this.booking.equals(review.getBooking())
        );
    }
}
