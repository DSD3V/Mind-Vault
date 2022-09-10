import { Router } from 'express';
import stringifyObject from 'stringify-object';

import { Thought } from '../schemas/Thought.js';
import { session } from '../server.js';

const router = Router();

router.delete('/deleteThought', async (req, res) => {
  const { thoughtId } = req.body;

  try {
    await session.run(
      `MATCH (thought: Thought)
       WHERE thought.thoughtId = '${thoughtId}'
       DETACH DELETE thought`
    );
    res.status(200).json({ message: 'Thought successfully deleted.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to delete thought.', error });
  }
});

router.patch('/editThoughts', async (req, res) => {
  const { thoughts } = req.body;
  const thoughtsWithIndex = thoughts.map((thought, index) => ({
    ...thought,
    index: `${thoughts.length - index - 1}`,
  }));

  try {
    await session.run(
      `UNWIND ${stringifyObject(thoughtsWithIndex)} as changedThought
       MATCH (thought: Thought)
       WHERE thought.thoughtId = changedThought.thoughtId
       SET thought.html = changedThought.html, thought.orderIndex = changedThought.index`
    );
    res.status(200).json({ message: 'Thoughts successfully edited.' });
  } catch (error) {
    res.status(400).json({ message: 'Failed to edit thoughts.', error });
  }
});

router.post('/addThought', async (req, res) => {
  const { newThoughtHTML, orderIndex, userId, vaultId } = req.query;
  const newThoughtId = userId + '-' + Date.now();

  try {
    await session.run(
      `MATCH (vault:Vault)
       WHERE vault.vaultId = '${vaultId}'
       CREATE (thought: Thought {html: '${newThoughtHTML.replace(/'/g, '&apos;')}', orderIndex: '${orderIndex}',
               thoughtId: '${newThoughtId}'})<-[:CONTAINS_THOUGHT]-(vault)`
    );
    const newThought = new Thought({
      html: newThoughtHTML,
      thoughtId: newThoughtId,
    });
    res.status(200).json({ message: 'Thought successfully added.', newThought });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add thought.', error });
  }
});

export default router;
