import mongoose from 'mongoose';
const { Schema } = mongoose;

const photoSchema = new Schema(
    {
        photo:  String,
        photoKey: String,
        owner: String,
        label: [String],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Photo", photoSchema);