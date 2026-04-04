import { Router } from "express";
import * as meetingsController from '../controllers/meetings.controller.js'

const router = Router();


router.post('/', meetingsController.create)
router.get('/', meetingsController.list)
router.get('/:id', meetingsController.getOne)
router.patch('/:id', meetingsController.update)
router.delete('/:id', meetingsController.remove)

router.post('/:id/summarize', meetingsController.summarize)




// # Login (or register) → TOKEN
// TOKEN="eyJ..."

// curl -s -X POST http://localhost:3000/api/meetings \
//   -H "Authorization: Bearer $TOKEN" \
//   -H "Content-Type: application/json" \
//   -d '{"title":"Weekly","transcript":"Alice: hello\nBob: hi"}' | jq

// curl -s http://localhost:3000/api/meetings \
//   -H "Authorization: Bearer $TOKEN" | jq

// curl -s "http://localhost:3000/api/meetings/MEETING_ID" \
//   -H "Authorization: Bearer $TOKEN" | jq


export default router;