const prisma = require("../config/prisma.js");

const createMessage = async (threadId, createdById, content) => {
  return await prisma.message.create({
    data: {
      threadId: parseInt(threadId),
      createdById: parseInt(createdById),
      content,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
};

const getMessageById = async (messageId) => {
  return await prisma.message.findUnique({
    where: { id: parseInt(messageId) },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
};

const getMessagesByThread = async (threadId) => {
  return await prisma.message.findMany({
    where: { threadId: parseInt(threadId) },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "asc" },
  });
};

const updateMessage = async (messageId, content) => {
  return await prisma.message.update({
    where: { id: parseInt(messageId) },
    data: { content },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
    },
  });
};

const deleteMessage = async (messageId) => {
  await prisma.message.delete({
    where: { id: parseInt(messageId) },
  });

  return true;
};

module.exports = {
  createMessage,
  getMessageById,
  getMessagesByThread,
  updateMessage,
  deleteMessage,
};
