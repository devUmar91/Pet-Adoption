import mongoose from "mongoose";




const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  contact:{
    type:Number,
    required:true,
  },
  adoptionStatus: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available',
  },
});

const Pet = mongoose.model('Pet', PetSchema);
export default Pet;
