import dotenv from "dotenv";
dotenv.config({
  path: "./config/.env",
});

export const config = {
  port: process.env.PORT || 3000,
};
