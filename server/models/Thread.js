const prisma = require("../config/prisma.js");

const createThread = async (projectId, createdById, title, content) => {
  return await prisma.thread.create({
    data: {
      projectId: parseInt(projectId),
      createdById: parseInt(createdById),
      title,
      content,
    },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      messages: {
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

const getThreadById = async (threadId) => {
  return await prisma.thread.findUnique({
    where: { id: parseInt(threadId) },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      messages: {
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

const getThreadsByProject = async (projectId) => {
  return await prisma.thread.findMany({
    where: { projectId: parseInt(projectId) },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      messages: {
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

const updateThread = async (threadId, title, content) => {
  return await prisma.thread.update({
    where: { id: parseInt(threadId) },
    data: { title, content },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      messages: {
        include: {
          createdBy: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

const deleteThread = async (threadId) => {
  await prisma.thread.delete({
    where: { id: parseInt(threadId) },
  });

  return true;
};

module.exports = {
  createThread,
  getThreadById,
  getThreadsByProject,
  updateThread,
  deleteThread,
};
