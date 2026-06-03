const Post = require("../models/Post");
const { uploadImage, deleteImage } = require("../services/cloudinaryService");
const { successResponse, errorResponse, paginatedResponse } = require("../utils/response");

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getFeedProjection = {
  "author._id": 1,
  "author.username": 1,
  "author.profileImage": 1,
  text: 1,
  image: 1,
  createdAt: 1,
  likesCount: { $size: "$likes" },
  commentsCount: { $size: "$comments" },
};

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * @desc    Create a new post (text only, image only, or both)
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text?.trim() && !file) {
      return errorResponse(res, "Post must have at least text or an image.", 400);
    }

    let imageUrl = "";
    let imagePublicId = "";

    if (file) {
      const result = await uploadImage(file.buffer, "mini-social/posts");
      imageUrl = result.url;
      imagePublicId = result.publicId;
    }

    const post = await Post.create({
      author: req.user._id,
      text: text?.trim() || "",
      image: imageUrl,
      imagePublicId,
    });

    await post.populate("author", "username profileImage");

    return successResponse(res, { post }, "Post created successfully.", 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated public feed
 * @route   GET /api/posts?page=1&limit=10
 * @access  Public
 */
const getFeed = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [posts, totalPosts] = await Promise.all([
      Post.aggregate([
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        {
          $project: {
            _id: 1,
            text: 1,
            image: 1,
            createdAt: 1,
            "author._id": 1,
            "author.username": 1,
            "author.profileImage": 1,
            likesCount: { $size: "$likes" },
            commentsCount: { $size: "$comments" },
          },
        },
      ]),
      Post.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return paginatedResponse(res, { posts }, {
      currentPage: page,
      totalPages,
      totalPosts,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single post with full details
 * @route   GET /api/posts/:id
 * @access  Public
 */
const getSinglePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username profileImage")
      .populate("likes.user", "username profileImage")
      .populate("comments.user", "username profileImage");

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    return successResponse(res, { post });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a post (author only)
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select("+imagePublicId");

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized to delete this post.", 403);
    }

    // Remove image from Cloudinary
    if (post.imagePublicId) {
      await deleteImage(post.imagePublicId);
    }

    await post.deleteOne();

    return successResponse(res, {}, "Post deleted successfully.");
  } catch (error) {
    next(error);
  }
};

// ─── Likes ────────────────────────────────────────────────────────────────────

/**
 * @desc    Toggle like on a post
 * @route   POST /api/posts/:id/like
 * @access  Private
 */
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    const userId = req.user._id;
    const alreadyLiked = post.likes.some(
      (like) => like.user.toString() === userId.toString()
    );

    if (alreadyLiked) {
      // Remove like
      post.likes = post.likes.filter(
        (like) => like.user.toString() !== userId.toString()
      );
    } else {
      // Add like
      post.likes.push({ user: userId });
    }

    await post.save();

    return successResponse(res, {
      liked: !alreadyLiked,
      likesCount: post.likes.length,
    }, alreadyLiked ? "Post unliked." : "Post liked.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get users who liked a post
 * @route   GET /api/posts/:id/likes
 * @access  Public
 */
const getPostLikes = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("likes.user", "username profileImage");

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    const users = post.likes.map((like) => like.user);

    return successResponse(res, {
      likesCount: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Comments ─────────────────────────────────────────────────────────────────

/**
 * @desc    Add a comment to a post
 * @route   POST /api/posts/:id/comment
 * @access  Private
 */
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    const comment = {
      user: req.user._id,
      username: req.user.username,
      text: text.trim(),
    };

    post.comments.push(comment);
    await post.save();

    // Return the newly added comment (last item)
    const newComment = post.comments[post.comments.length - 1];

    return successResponse(
      res,
      {
        comment: newComment,
        commentsCount: post.comments.length,
      },
      "Comment added.",
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all comments on a post
 * @route   GET /api/posts/:id/comments
 * @access  Public
 */
const getPostComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).select("comments");

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    return successResponse(res, {
      commentsCount: post.comments.length,
      comments: post.comments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment (comment author only)
 * @route   DELETE /api/posts/:id/comments/:commentId
 * @access  Private
 */
const deleteComment = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return errorResponse(res, "Post not found.", 404);
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return errorResponse(res, "Comment not found.", 404);
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, "Not authorized to delete this comment.", 403);
    }

    comment.deleteOne();
    await post.save();

    return successResponse(res, { commentsCount: post.comments.length }, "Comment deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPost,
  getFeed,
  getSinglePost,
  deletePost,
  toggleLike,
  getPostLikes,
  addComment,
  getPostComments,
  deleteComment,
};
