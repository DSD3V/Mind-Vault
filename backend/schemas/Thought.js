import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const model = mongoose.model;

export const ThoughtSchema = new Schema();

ThoughtSchema.add({
  html: String,
  thoughtId: String,
});

export const Thought = model('Thought', ThoughtSchema);
