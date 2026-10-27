import { clerkClient, getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    let user = await User.findOne({ clerkId: userId });

    // Webhooks can be delayed or unavailable in local development. Provision
    // the profile from Clerk's verified user record on the first API request.
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      const email =
        clerkUser.emailAddresses?.find((item) => item.id === clerkUser.primaryEmailAddressId)?.emailAddress ??
        clerkUser.emailAddresses?.[0]?.emailAddress;

      if (!email) {
        res.status(422).json({ message: "Your Clerk account needs a primary email address" });
        return;
      }

      const fullName =
        [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
        clerkUser.username ||
        email.split("@")[0];

      user = await User.findOneAndUpdate(
        { clerkId: userId },
        {
          $set: {
            email,
            fullName,
            profilePic: clerkUser.imageUrl || "",
          },
          $setOnInsert: { clerkId: userId },
        },
        { returnDocument: "after", upsert: true, setDefaultsOnInsert: true },
      );
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
