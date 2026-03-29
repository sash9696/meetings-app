import * as meetingsService from '../services/meetings.service.js';

function handleError(res, error) {
  const status = error.statusCode || 500;
  const message = error.message || 'Server error';
  return res.status(status).json({ error: message });
}

export async function create(req, res) {
  try {
    const { title, transcript } = req.body || {};
    if (!title || !transcript) {
      return res.status(400).json({ error: 'title and transcript required' });
    }
    const meeting = await meetingsService.createMeeting(req.userId, {
      title,
      transcript,
    });
    return res.status(201).json({ meeting });
  } catch (e) {
    return handleError(res, e);
  }
}

export async function list(req, res) {
  try {
    const meetings = await meetingsService.listMeetings(req.userId);
    return res.json({ meetings });
  } catch (e) {
    return handleError(res, e);
  }
}

export async function getOne(req, res) {
  try {
    const meeting = await meetingsService.getMeeting(
      req.userId,
      req.params.id
    );
    return res.json({ meeting });
  } catch (e) {
    return handleError(res, e);
  }
}

export async function update(req, res) {
  try {
    const meeting = await meetingsService.updateMeeting(
      req.userId,
      req.params.id,
      req.body || {}
    );
    return res.json({ meeting });
  } catch (e) {
    return handleError(res, e);
  }
}

export async function remove(req, res) {
  try {
    await meetingsService.deleteMeeting(req.userId, req.params.id);
    return res.status(204).send();
  } catch (e) {
    return handleError(res, e);
  }
}