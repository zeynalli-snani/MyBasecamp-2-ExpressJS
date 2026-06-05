const Project = require("../models/Project.js");
const Attachment = require("../models/Attachment.js");
const Thread = require("../models/Thread.js");
const Message = require("../models/Message.js");
const User = require("../models/User.js");

const getCurrentUserId = (req) => req.session?.user?.id;

const loadProjectOr404 = async (projectId, res) => {
  const project = await Project.getProjectById(projectId);
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return null;
  }

  return project;
};

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const ownerId = getCurrentUserId(req);

    const project = await Project.createProject(name, description, ownerId);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const projects = await Project.getAllProjects(userId);
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const userId = getCurrentUserId(req);
    const projectId = req.params.id;

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canEdit = await Project.isProjectAdmin(projectId, userId);
    if (!canEdit) {
      return res.status(403).json({ error: "Only the project admin can edit this project" });
    }

    const updatedProject = await Project.updateProject(
      projectId,
      req.body.name,
      req.body.description,
    );
    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canDelete = await Project.isProjectAdmin(projectId, userId);
    if (!canDelete) {
      return res.status(403).json({ error: "You do not have permission to delete this project" });
    }

    await Project.deleteProject(projectId);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const addMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);
    const memberId = req.body.userId;

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canManage = await Project.isProjectAdmin(projectId, userId);
    if (!canManage) {
      return res.status(403).json({ error: "Only the project admin can manage members" });
    }

    if (!memberId) {
      return res.status(400).json({ error: "User id is required" });
    }

    const user = await User.findUserById(memberId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const member = await Project.addProjectMember(projectId, memberId);
    res.status(201).json(member);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "User is already associated with this project" });
    }
    res.status(500).json({ error: err.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const projectId = req.params.id;
    const memberId = req.params.userId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canManage = await Project.isProjectAdmin(projectId, userId);
    if (!canManage) {
      return res.status(403).json({ error: "Only the project admin can manage members" });
    }
    if (project.ownerId === parseInt(memberId)) {
      return res.status(400).json({ error: "The project owner cannot be removed" });
    }

    await Project.removeProjectMember(projectId, memberId);
    res.json({ message: "Member removed successfully" });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Member association not found" });
    }
    res.status(500).json({ error: err.message });
  }
};

const listProjectUsers = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const members = project.members.map((member) => member.user);
    const users = [project.owner, ...members.filter((member) => member.id !== project.owner.id)];

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAttachment = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const { name, format, link } = req.body;
    if (!name || !format) {
      return res.status(400).json({ error: "Name and format are required" });
    }

    const attachment = await Attachment.createAttachment(projectId, userId, name, format, link);
    res.status(201).json(attachment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteAttachment = async (req, res) => {
  try {
    const projectId = req.params.id;
    const attachmentId = req.params.attachmentId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const attachment = await Attachment.getAttachmentById(attachmentId);
    if (!attachment || attachment.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Attachment not found" });
    }

    const isAdmin = await Project.isProjectAdmin(projectId, userId);
    if (attachment.uploadedById !== parseInt(userId) && !isAdmin) {
      return res.status(403).json({ error: "You do not have permission to delete this attachment" });
    }

    await Attachment.deleteAttachment(attachmentId);
    res.json({ message: "Attachment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createThread = async (req, res) => {
  try {
    const projectId = req.params.id;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canManage = await Project.isProjectAdmin(projectId, userId);
    if (!canManage) {
      return res.status(403).json({ error: "Only the project admin can create a thread" });
    }

    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const thread = await Thread.createThread(projectId, userId, title, content);
    res.status(201).json(thread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateThread = async (req, res) => {
  try {
    const projectId = req.params.id;
    const threadId = req.params.threadId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canManage = await Project.isProjectAdmin(projectId, userId);
    if (!canManage) {
      return res.status(403).json({ error: "Only the project admin can edit a thread" });
    }

    const thread = await Thread.getThreadById(threadId);
    if (!thread || thread.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const updatedThread = await Thread.updateThread(threadId, req.body.title, req.body.content);
    res.json(updatedThread);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteThread = async (req, res) => {
  try {
    const projectId = req.params.id;
    const threadId = req.params.threadId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canManage = await Project.isProjectAdmin(projectId, userId);
    if (!canManage) {
      return res.status(403).json({ error: "Only the project admin can delete a thread" });
    }

    const thread = await Thread.getThreadById(threadId);
    if (!thread || thread.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Thread not found" });
    }

    await Thread.deleteThread(threadId);
    res.json({ message: "Thread deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createMessage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const threadId = req.params.threadId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const thread = await Thread.getThreadById(threadId);
    if (!thread || thread.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: "Message content is required" });
    }

    const message = await Message.createMessage(threadId, userId, content);
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateMessage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const threadId = req.params.threadId;
    const messageId = req.params.messageId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const thread = await Thread.getThreadById(threadId);
    if (!thread || thread.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const message = await Message.getMessageById(messageId);
    if (!message || message.threadId !== parseInt(threadId)) {
      return res.status(404).json({ error: "Message not found" });
    }

    const canEdit = message.createdById === parseInt(userId) || (await Project.isProjectAdmin(projectId, userId));
    if (!canEdit) {
      return res.status(403).json({ error: "You do not have permission to edit this message" });
    }

    const updatedMessage = await Message.updateMessage(messageId, req.body.content);
    res.json(updatedMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const projectId = req.params.id;
    const threadId = req.params.threadId;
    const messageId = req.params.messageId;
    const userId = getCurrentUserId(req);

    const project = await loadProjectOr404(projectId, res);
    if (!project) return;

    const canAccess = await Project.isProjectMember(projectId, userId);
    if (!canAccess) {
      return res.status(403).json({ error: "You do not have access to this project" });
    }

    const thread = await Thread.getThreadById(threadId);
    if (!thread || thread.projectId !== parseInt(projectId)) {
      return res.status(404).json({ error: "Thread not found" });
    }

    const message = await Message.getMessageById(messageId);
    if (!message || message.threadId !== parseInt(threadId)) {
      return res.status(404).json({ error: "Message not found" });
    }

    const canDelete = message.createdById === parseInt(userId) || (await Project.isProjectAdmin(projectId, userId));
    if (!canDelete) {
      return res.status(403).json({ error: "You do not have permission to delete this message" });
    }

    await Message.deleteMessage(messageId);
    res.json({ message: "Message deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  listProjectUsers,
  createAttachment,
  deleteAttachment,
  createThread,
  updateThread,
  deleteThread,
  createMessage,
  updateMessage,
  deleteMessage,
};
