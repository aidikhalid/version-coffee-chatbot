import { Router } from "express";
import { getAllProducts } from "../controllers/product-controllers.js";

const productRoutes = Router();

productRoutes.get("/", getAllProducts);

export default productRoutes;
