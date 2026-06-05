const prisma = require("../config/prisma.js");

const createAttachment = async (projectId, uploadedById, name, format, link) => {
  return await prisma.attachment.create({
    data: {
      projectId: parseInt(projectId),
      uploadedById: parseInt(uploadedById),
      name,
      format,
      link: link || null,
    },
    include: {
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
  });
};

const getAttachmentById = async (attachmentId) => {
  return await prisma.attachment.findUnique({
    where: { id: parseInt(attachmentId) },
    include: {
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
  });
};

const getAttachmentsByProject = async (projectId) => {
  return await prisma.attachment.findMany({
    where: { projectId: parseInt(projectId) },
    include: {
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

const deleteAttachment = async (attachmentId) => {
  await prisma.attachment.delete({
    where: { id: parseInt(attachmentId) },
  });

  return true;
};

module.exports = {
  createAttachment,
  getAttachmentById,
  getAttachmentsByProject,
  deleteAttachment,
};
