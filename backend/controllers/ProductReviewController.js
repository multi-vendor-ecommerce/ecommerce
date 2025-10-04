import ProductReview from "../models/ProductReview.js";
import Product from "../models/Products.js";
import { isValidObjectId } from "mongoose";

// ==========================
// Add a review
// ==========================
export const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.person?.id;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Check if already reviewed
    const existing = await ProductReview.findOne({ product: productId, user: userId });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already reviewed this product." });
    }

    // Offensive words filter
    const bannedWords = [
      "idiot", "stupid", "dumb", "hate", "ugly", "sucks", "trash", "loser", "bastard", "fool", "moron", "kill", "terrorist", "shit", "damn", "crap", "asshole", "bitch", "slut", "whore", "faggot", "retard", "screw", "piss", "bloody", "dammit", "jerk", "dick", "cock", "pussy", "f*ck", "nigger", "fuck you", "chink", "kike", "cunt", "motherfucker", "arsehole", "bollocks", "bugger", "asshole"
    ];

    const containsBannedWord = (text) => {
      if (!text) return false;
      const lower = text.toLowerCase();
      return bannedWords.some(word => lower.includes(word));
    };

    if (containsBannedWord(comment)) {
      return res.status(400).json({
        success: false,
        message: "Comment contains inappropriate language."
      });
    }

    // Create review
    const review = await ProductReview.create({
      product: productId,
      user: userId,
      rating: Number(rating),
      comment: comment?.trim().slice(0, 500), // limit to 500 chars
    });

    // Update product aggregate rating
    const stats = await ProductReview.aggregate([
      { $match: { product: product._id } },
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(product._id, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        totalReviews: stats[0].totalReviews
      });
    }

    // Populate user name for safe frontend response
    await review.populate("user", "name");

    // Send safe response
    res.status(201).json({
      success: true,
      message: "Review added.",
      review: {
        _id: review._id,
        rating: review.rating,
        comment: review.comment,
        user: {
          name: review.user.name
        },
        helpfulCount: review.helpfulCount,
        createdAt: review.createdAt
      }
    });

  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ success: false, message: "Unable to add review." });
  }
};

// ==========================
// Get reviews of a product
// ==========================
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ success: false, message: "Invalid product ID." });
    }

    const reviews = await ProductReview.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const safeReviews = reviews.map(r => ({
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      user: {
        name: r.user?.name || "Anonymous"
      },
      helpfulCount: r.helpfulCount,
      createdAt: r.createdAt
    }));

    res.status(200).json({ success: true, reviews: safeReviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ success: false, message: "Unable to load reviews." });
  }
};

// ==========================
// Mark review as helpful
// ==========================
export const markHelpful = async (req, res) => {
  const { id } = req.params;
  const userId = req.person?.id;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid review ID." });
    }

    const review = await ProductReview.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    if (review.helpfulBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "Already marked as helpful." });
    }

    review.helpfulCount += 1;
    review.helpfulBy.push(userId);
    await review.save();

    res.status(200).json({ success: true, helpfulCount: review.helpfulCount });
  } catch (error) {
    console.error("Mark helpful error:", error);
    res.status(500).json({ success: false, message: "Unable to mark helpful." });
  }
};