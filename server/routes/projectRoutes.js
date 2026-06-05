const express = require('express')
const router = express.Router()

const {
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
} = require('../controllers/projectController')
const auth = require('../middleware/auth.js')

router.post('/', auth, createProject)
router.get('/', auth, getAllProjects)
router.get('/:id', auth, getProject)
router.put('/:id', auth, updateProject)
router.delete('/:id', auth, deleteProject)
router.get('/:id/users', auth, listProjectUsers)
router.post('/:id/members', auth, addMember)
router.delete('/:id/members/:userId', auth, removeMember)
router.post('/:id/attachments', auth, createAttachment)
router.delete('/:id/attachments/:attachmentId', auth, deleteAttachment)
router.post('/:id/threads', auth, createThread)
router.put('/:id/threads/:threadId', auth, updateThread)
router.delete('/:id/threads/:threadId', auth, deleteThread)
router.post('/:id/threads/:threadId/messages', auth, createMessage)
router.put('/:id/threads/:threadId/messages/:messageId', auth, updateMessage)
router.delete('/:id/threads/:threadId/messages/:messageId', auth, deleteMessage)

module.exports = router
