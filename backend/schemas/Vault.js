import mongoose from 'mongoose';

import { ThoughtSchema } from './Thought.js';

const { model, Schema } = mongoose;

const VaultSchema = new Schema();

VaultSchema.add({
  childVaults: [VaultSchema],
  imageUrl: String,
  name: String,
  thoughts: [ThoughtSchema],
  vaultId: String,
});

export const Vault = model('Vault', VaultSchema);
