import { Router } from "express";
import { saveAppointment , getAppointment, updateAppointment, cancelAppointment} from "./appointment.controller.js";
import { createAppointmentValidator, updateAppointmentValidator, cancelAppointmentValidator } from "../middlewares/appointment-validators.js";

const router = Router();

router.post("/createAppointment", createAppointmentValidator, saveAppointment);

//Metodo http para mandar a buscar todas las citas.
router.get("/", getAppointment)

//Metodo http para actualizar cita.
router.put("/updateAppointment/:id", updateAppointmentValidator, updateAppointment);

router.delete("/cancelAppointment/:id", cancelAppointmentValidator, cancelAppointment)

export default router;

