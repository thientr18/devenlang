import { Router } from "express";
import { Request, Response } from "express";

const router = Router();

router.get("/api/users", (req: Request, res: Response) => {
    res.status(200).json({ message: "User list" });
});

export default router;