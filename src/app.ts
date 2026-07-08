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

app.use("/api/auth", AuthRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/categories", CategoryRoutes);
app.use("/api/landlord", LandlordRoutes);
app.use("/api/rentals", RentalRoutes);
app.use("/api/reviews", ReviewRoutes);
app.use("/api/admin/users", AdminRoutes);

app.use(notFoundMiddleware);
app.use(globalErrorHandler);

export default app;