const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: [2200, "Post text cannot exceed 2200 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: "",
      select: false,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

// Ensure at least text or image is provided
postSchema.pre("validate", function (next) {
  if (!this.text && !this.image) {
    this.invalidate("text", "Post must have at least text or an image");
  }
  next();
});

// Virtual fields for counts
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

// Indexes for performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);
