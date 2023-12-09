const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: [true, "обязательное поле"],
    },
    director: {
      type: String,
      required: [true, "обязательное поле"],
    },
    duration: {
      type: Number,
      required: [true, "обязательное поле"],
    },
    year: {
      type: String,
      required: [true, "обязательное поле"],
    },
    description: {
      type: String,
      required: [true, "обязательное поле"],
    },
    image: {
      type: String,
      required: [true, "обязательное поле"],
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            url
          );
        },
        message: "Введите Url",
      },
    },
    trailerLink: {
      type: String,
      required: [true, "обязательное поле"],
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            url
          );
        },
        message: "Введите Url",
      },
    },
    thumbnail: {
      type: String,
      required: [true, "обязательное поле"],
      validate: {
        validator(url) {
          return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(
            url
          );
        },
        message: "Введите Url",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },

    nameRU: {
      type: String,
      required: true,
    },

    nameEN: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("movie", movieSchema);
