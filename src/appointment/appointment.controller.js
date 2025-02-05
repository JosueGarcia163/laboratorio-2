import Pet from "../pet/pet.model.js";
import Appointment from "../appointment/appointment.model.js";
import { parse } from "date-fns";
import User from '../user/user.model.js';

export const saveAppointment = async (req, res) => {
  try {
    const data = req.body;

    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findOne({ _id: data.pet });
    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la mascota"
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const appointment = new Appointment({ ...data, date: isoDate });
    await appointment.save();

    return res.status(200).json({
      success: true,
      msg: `Cita creada exitosamente en fecha ${data.date}`,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al crear la cita",
      error
    });
  }
};

export const getAppointment = async (req, res) => {
  const { limite = 10, desde = 0 } = req.query;
  const query = { status: true };

  try {
    const appointments = await Appointment.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("keeper", "nombre") 
      .populate("pet", "nombre");

    const total = await Appointment.countDocuments(query);

    res.status(200).json({
      success: true,
      total,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener las citas",
      error: error.message,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const isoDate = new Date(data.date);

    if (isNaN(isoDate.getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Fecha inválida",
      });
    }

    const pet = await Pet.findById(data.pet);
    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "No se encontró la mascota",
      });
    }

    const existAppointment = await Appointment.findOne({
      pet: data.pet,
      user: data.user,
      date: {
        $gte: new Date(isoDate).setHours(0, 0, 0, 0),
        $lt: new Date(isoDate).setHours(23, 59, 59, 999),
      },
      _id: { $ne: id }, 
    });

    if (existAppointment) {
      return res.status(400).json({
        success: false,
        msg: "El usuario y la mascota ya tienen una cita para este día",
      });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { ...data, date: isoDate },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({
        success: false,
        msg: "Cita no encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      msg: `Cita actualizada exitosamente en fecha ${data.date}`,
      appointment: updatedAppointment,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      msg: "Error al actualizar cita.",
      error: err.message,
    });
  }
};

//Funcion para cancelar cita.
export const cancelAppointment = async (req, res) => {
  try {
      const { uid } = req.params

      const appointment = await Appointment.findByIdAndUpdate(uid, { status: CANCELLED }, { new: true })

      return res.status(200).json({
          success: true,
          message: "cita cancelado",
          appointment


      })
  } catch (err) {
      return res.status(500).json({
          success: false,
          message: "Error al cancelar los cita",
          error: err.message

      })
  }

}



