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
  try {
    const { id } = req.params;

    if (id) {
      const appointment = await Appointment.findById(id).populate("pet user");
      if (!appointment) {
        return res.status(404).json({
          success: false,
          msg: "Cita no encontrada",
        });
      }
      return res.status(200).json({ success: true, appointment });
    }

    const appointments = await Appointment.find().populate("pet user");
    return res.status(200).json({ success: true, appointments });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al obtener citas",
      error,
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: "Cita no encontrada",
      });
    }

    //Validamos que el usuario exista en la base de datos.
    const user =  await User.findById(data.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Usuario no encontrado",
      });
    }

    const pet = await Pet.findById(data.pet)
    if (!pet) {
      return res.status(404).json({
        success: false,
        msg: "Mascota no encontrada",
      });
    }

    if (data.date) {
      const isoDate = new Date(data.date);
      if (isNaN(isoDate.getTime())) {
        return res.status(400).json({
          success: false,
          msg: "Fecha inválida",
        });
      }
      data.date = isoDate;
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, data, { new: true });

    return res.status(200).json({
      success: true,
      msg: "Cita actualizada correctamente",
      appointment: updatedAppointment,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      msg: "Error al actualizar la cita",
      error,
    });
  }
};


//Funcion para cancelar cita.
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params

    const appointment = await Appointment.findById(id)

    //si la cita esta vacia
    if (!appointment){
      return res.status(404).json({
        success: false,
        message:"Cita no encontrada"
      });
    }

    //validacion para ver si la cita ya esta cancelada.
    if(appointment.status == "CANCELLED"){
      return res.status(400).json({
        success: false,
        message: "La cita ya ha sido cancelada previamente"

      });
    }

    //despues de las validaciones hacemos que actualize el estado de la cita.
    const updateAppointment = await Appointment.findByIdAndUpdate(  
      id,
      { status: "CANCELLED"},
      {new: true}
  
    )

    return res.status(200).json({
      success: true,
      message: "cita cancelada",
      appointment: updateAppointment


    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error al cancelar los cita",
      error: err.message

    })
  }

}



