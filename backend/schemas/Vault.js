import mongoose from 'mongoose';

import { ThoughtSchema } from './Thought.js';

const Schema = mongoose.Schema;
const model = mongoose.model;

const VaultSchema = new Schema();

VaultSchema.add({
  childVaults: [VaultSchema],
  imageUrl: String,
  name: String,
  thoughts: [ThoughtSchema],
  vaultId: String,
});

export const Vault = model('Vault', VaultSchema);
