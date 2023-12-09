const Movie = require("../models/movie");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const { CREATED_STATUS, SUCCESS_STATUS } = require("../constants");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate("owner", req.user._id)
    .then((data) => {
      if (!data) {
        throw new NotFoundError("Пользователь не был найден");
      } else {
        res.status(SUCCESS_STATUS).send(data);
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Ошибка"));
      } else {
        next(err);
      }
    });
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.status(CREATED_STATUS).send(movie);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { id: movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError("Фильм не найден"));
      } else if (movie.owner.toString() !== req.user._id) {
        next(
          new ForbiddenError(
            "Данный фил м нельзя удалить так как вы не являеть создателем"
          )
        );
      } else {
        Movie.findByIdAndDelete(movieId)
          .then((deletedMovie) => {
            res.status(200).send({ data: deletedMovie });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      next(err);
    });
};
