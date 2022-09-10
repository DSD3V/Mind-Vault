import mongoose from 'mongoose';

const { model, Schema } = mongoose;

export const ThoughtSchema = new Schema();

ThoughtSchema.add({
  html: String,
  thoughtId: String,
});

export const Thought = model('Thought', ThoughtSchema);
