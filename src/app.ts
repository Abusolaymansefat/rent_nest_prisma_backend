import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { AuthRoutes } from "./modules/auth/auth.routes";
import { PropertyRoutes } from "./modules/property/property.routes";
import { CategoryRoutes } from "./modules/Category/category.router";
import { LandlordRoutes } from "./modules/landlord/landlord.router";
import { RentalRoutes } from "./modules/rental/rental.router";
import { AdminRoutes } from "./modules/admin/admin.roter";
import { ReviewRoutes } from "./modules/review/review.routrt";
import { notFoundMiddleware } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { PaymentRoutes } from "./modules/payment/payment.router";


const app: Application = express();

app.use(cors({
      origin: config.app_url,
      credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
      res.send("Hello World!");
});


// routes 

// auth routes
app.use("/api/auth", AuthRoutes);
// property routes
app.use("/api/properties", PropertyRoutes);
// category routes
app.use("/api/categories", CategoryRoutes);

// landlord routes
app.use("/api/landlord", LandlordRoutes);

// rental routes
app.use("/api/rentals", RentalRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/admin/users", AdminRoutes);
app.use("/api//api/payments", PaymentRoutes)

app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;