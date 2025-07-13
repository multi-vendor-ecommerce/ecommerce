    import express from "express";
    import { createCategory, getCategories} from "../controllers/categoryController.js";

    const router = express.Router();

    // Use controller functions
    router.post("/", createCategory);
    router.get("/allCategory", getCategories);

    export default router;
