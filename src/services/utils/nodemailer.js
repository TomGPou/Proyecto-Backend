import nodemailer from "nodemailer";
import config from "../../config.js";

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.GMAIL_APP_USER,
    pass: config.GMAIL_APP_PASS,
  },
});

export const purchaseMail = async (ticket) => {
  return await transport.sendMail({
    from: `Proyecto Ecommerce <${config.GMAIL_APP_USER}>`,
    to: ticket.purchaser,
    subject: `Confirmación de compra - Ticket #${ticket.code}`,
    html: `
    <h1>Ticket #${ticket.code}</h1>
    <p>Se ha realizado la compracomprado correctamente</p>
    <p>Valor total de la compra: $${ticket.amount}</p>
    `,
  });
};

export const restoreMail = async (link, email) => {
  return await transport.sendMail({
    from: `Proyecto Ecommerce <${config.GMAIL_APP_USER}>`,
    to: email,
    subject: `Reestablecimiento de contraseña`,
    html: `
    <h1>Reestablecer contraseña</h1>
    <p>Ingresa en el siguient link para reestablecer su contraseña</p>
    <a href="${link}">${link}</a></p>
    `,
  });
};

export const deleteUserMail = async (email) => {
  return await transport.sendMail({
    from: `Proyecto Ecommerce <${config.GMAIL_APP_USER}>`,
    to: email,
    subject: `Usuario eliminado`,
    html: `
    <h1>Proyecto Ecommerce</h1>
    <p>Su usuario ha sido eliminado por inactividad</p>
    <p>Si lo desea puede registrarse nuevamente</p>
    `,
  });
}
