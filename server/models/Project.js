const prisma = require("../config/prisma.js");

const projectInclude = {
  owner: { select: { id: true, name: true, email: true, role: true } },
  members: {
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  },
  attachments: {
    include: {
      uploadedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  },
  threads: {
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
  },
};

const createProject = async (name, description, ownerId) => {
  return await prisma.project.create({
    data: {
      name,
      description,
      ownerId: parseInt(ownerId),
      members: {
        create: {
          userId: parseInt(ownerId),
        },
      },
    },
    include: projectInclude,
  });
};

const getAllProjects = async (userId) => {
  const parsedUserId = parseInt(userId);

  return await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: parsedUserId },
        { members: { some: { userId: parsedUserId } } },
      ],
    },
    include: projectInclude,
    orderBy: { createdAt: "desc" },
  });
};

const getProjectById = async (id) => {
  return await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: projectInclude,
  });
};

const updateProject = async (id, name, description) => {
  return await prisma.project.update({
    where: { id: parseInt(id) },
    data: { name, description },
    include: projectInclude,
  });
};

const deleteProject = async (id) => {
  await prisma.project.delete({
    where: { id: parseInt(id) },
  });
  return true;
};

const addProjectMember = async (projectId, userId) => {
  return await prisma.projectMember.create({
    data: {
      projectId: parseInt(projectId),
      userId: parseInt(userId),
    },
    include: {
      user: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

const removeProjectMember = async (projectId, userId) => {
  await prisma.projectMember.delete({
    where: {
      projectId_userId: {
        projectId: parseInt(projectId),
        userId: parseInt(userId),
      },
    },
  });

  return true;
};

const getProjectMemberIds = async (projectId) => {
  const members = await prisma.projectMember.findMany({
    where: { projectId: parseInt(projectId) },
    select: { userId: true },
  });

  return members.map((member) => member.userId);
};

const isProjectMember = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: parseInt(projectId),
      OR: [
        { ownerId: parseInt(userId) },
        { members: { some: { userId: parseInt(userId) } } },
      ],
    },
    select: { id: true },
  });

  return Boolean(project);
};

const isProjectAdmin = async (projectId, userId) => {
  const project = await prisma.project.findFirst({
    where: {
      id: parseInt(projectId),
      ownerId: parseInt(userId),
    },
    select: { id: true },
  });

  return Boolean(project);
};

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  getProjectMemberIds,
  isProjectMember,
  isProjectAdmin,
};
